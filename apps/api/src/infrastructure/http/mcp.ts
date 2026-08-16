import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// A module binds a tool under this token. McpRouter collects and registers each.
export const McpTool = Symbol("McpTool");
export interface McpTool {
	register(server: McpServer): void;
}

// The set of tool names that require auth. Each module registers its own.
export const PrivateToolNames = Symbol("PrivateToolNames");

// Fresh server per request. Tools are layered on by McpRouter.
export function createMcpServer(): McpServer {
	return new McpServer(
		{ name: "@thoth/api", title: "Thoth", version: "0.0.0" },
		{
			instructions:
				"Public MCP server exposing site content: bio, projects, and posts.",
		},
	);
}
