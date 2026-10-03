import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { onTestFinished } from "vitest";
import {
	createMcpServer,
	type McpRequestContext,
	type McpTool,
} from "~/infrastructure/mcp/index";

// Spin up an MCP server with the given tools and return a client wired to it
// over an in-memory transport. The connection closes itself when the test ends.
export const connectMcp = async (
	context: McpRequestContext,
	...tools: McpTool[]
): Promise<Client> => {
	const server = createMcpServer();
	for (const tool of tools) {
		tool.register(server, context);
	}

	const [clientTransport, serverTransport] =
		InMemoryTransport.createLinkedPair();
	const client = new Client({ name: "test", version: "0" });
	await Promise.all([
		server.connect(serverTransport),
		client.connect(clientTransport),
	]);

	onTestFinished(() => client.close());
	return client;
};
