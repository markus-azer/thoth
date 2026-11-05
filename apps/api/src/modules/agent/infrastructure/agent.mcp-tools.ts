import { DynamicStructuredTool } from "@langchain/core/tools";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { inject, injectable, multiInject, optional } from "inversify";
import {
	createMcpServer,
	McpTool,
	PrivateToolNames,
} from "~/infrastructure/mcp/index";
import type { AgentTools, Toolbox } from "../application/ports/index";

const CLIENT_INFO = { name: "thoth-agent", version: "0.0.0" };

@injectable()
export class McpAgentTools implements AgentTools {
	constructor(
		@multiInject(McpTool)
		@optional()
		private readonly mcpTools: McpTool[] = [],
		@inject(PrivateToolNames) private readonly privateNames: Set<string>,
	) {}

	async open(handle: string): Promise<Toolbox> {
		const server = this.buildServer(handle);
		const client = await this.connect(server);
		const tools = await this.listPublicTools(client);

		return { tools, close: () => this.disconnect(client, server) };
	}

	private buildServer(handle: string): McpServer {
		const server = createMcpServer();

		for (const mcpTool of this.mcpTools) {
			mcpTool.register(server, { handle });
		}

		return server;
	}

	private async connect(server: McpServer): Promise<Client> {
		const client = new Client(CLIENT_INFO);
		const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();

		await Promise.all([server.connect(serverSide), client.connect(clientSide)]);

		return client;
	}

	private async disconnect(client: Client, server: McpServer): Promise<void> {
		await Promise.all([client.close(), server.close()]);
	}

	private async listPublicTools(client: Client) {
		const { tools } = await client.listTools();

		const publicTools = tools.filter(
			({ name }) => !this.privateNames.has(name),
		);

		return publicTools.map((tool) => this.toLangChainTool(client, tool));
	}

	private toLangChainTool(
		client: Client,
		{ name, description, inputSchema }: Tool,
	) {
		return new DynamicStructuredTool({
			name,
			description: description ?? name,
			schema: inputSchema,
			func: (args: Record<string, unknown>) =>
				this.callTool(client, name, args),
		});
	}

	private async callTool(
		client: Client,
		name: string,
		args: Record<string, unknown>,
	): Promise<string> {
		const result = await client.callTool({ name, arguments: args });

		const text = this.textOf(result.content);

		if (result.isError) throw new Error(text);

		return text;
	}

	private textOf(content: unknown): string {
		const parts = Array.isArray(content) ? content : [];

		return parts
			.filter((part) => part.type === "text")
			.map((part) => part.text)
			.join("\n");
	}
}
