import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import express, { type Request, type Response, Router } from "express";
import { injectable, multiInject, optional } from "inversify";
import { createMcpServer, McpTool } from "../mcp";

@injectable()
export class McpRouter {
	constructor(
		@multiInject(McpTool)
		@optional()
		private readonly tools: McpTool[] = [],
	) {}

	get routes(): Router {
		const router = Router();
		router.post("/", express.json(), this.handle);
		return router;
	}

	// One MCP server per request, stateless. For sessions, add a
	// Lifecycle-managed transport store plus GET/DELETE handlers.
	private readonly handle = async (
		req: Request,
		res: Response,
	): Promise<void> => {
		const server = this.buildServer();
		const transport = new StreamableHTTPServerTransport({
			enableJsonResponse: true,
		});

		// Release on disconnect.
		res.on("close", () => {
			void server.close();
		});

		// Cast: SDK types predate exactOptionalPropertyTypes.
		await server.connect(transport as Transport);
		await transport.handleRequest(req, res, req.body);
	};

	private buildServer(): McpServer {
		const server = createMcpServer();
		for (const tool of this.tools) {
			tool.register(server);
		}
		return server;
	}
}
