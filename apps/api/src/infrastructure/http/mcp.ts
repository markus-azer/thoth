import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Mirrors auth's Principal. Direct import would break barrel-excludes-domain.
export interface McpPrincipal {
	userId: string;
	scopes: string[];
}

// Per-request data passed to every tool's register() call.
export interface McpRequestContext {
	// Set on `/mcp/:identifier`. Undefined on bare `/mcp`.
	identifier?: string;
	// Set once mcpAuthMiddleware verifies a bearer for a private tool call.
	principal?: McpPrincipal;
}

// A module binds a tool under this token. McpRouter collects and registers each.
export const McpTool = Symbol("McpTool");
export interface McpTool {
	register(server: McpServer, context: McpRequestContext): void;
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
