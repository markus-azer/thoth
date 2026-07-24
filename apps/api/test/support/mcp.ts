import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer, type McpTool } from "~/infrastructure/http/index";

// Spin up an MCP server with the given tools and return a client wired to it
// over an in-memory transport. Use in any MCP tool test.
export const connectMcp = async (...tools: McpTool[]): Promise<Client> => {
	const server = createMcpServer();
	for (const tool of tools) {
		tool.register(server);
	}

	const [clientTransport, serverTransport] =
		InMemoryTransport.createLinkedPair();
	const client = new Client({ name: "test", version: "0" });
	await Promise.all([
		server.connect(serverTransport),
		client.connect(clientTransport),
	]);

	return client;
};
