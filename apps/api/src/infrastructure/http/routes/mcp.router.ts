import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { type Request, type Response, Router } from "express";
import { injectable, multiInject, optional } from "inversify";
import {
	createMcpServer,
	type McpRequestContext,
	McpTool,
} from "~/infrastructure/mcp/index";

@injectable()
export class McpRouter {
	constructor(
		@multiInject(McpTool)
		@optional()
		private readonly tools: McpTool[] = [],
	) {}

	// Body is parsed upstream in AppRouter.
	// `/:handle` is the shareable public-read mount. Bare `/` is the owner's.
	get routes(): Router {
		const router = Router();
		router.post("/", this.handle);
		router.post("/:handle", this.handle);
		return router;
	}

	// One MCP server per request, stateless. For sessions, add a
	// Lifecycle-managed transport store plus GET/DELETE handlers.
	private readonly handle = async (
		req: Request,
		res: Response,
	): Promise<void> => {
		const context = this.buildContext(req, res);
		const server = this.buildServer(context);
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

	private buildContext(req: Request, res: Response): McpRequestContext {
		const context: McpRequestContext = {};

		const handle = req.params["handle"];
		if (typeof handle === "string" && handle) {
			context.handle = handle;
		}

		const principal = res.locals["principal"];
		if (principal) context.principal = principal;

		return context;
	}

	private buildServer(context: McpRequestContext): McpServer {
		const server = createMcpServer();
		for (const tool of this.tools) {
			tool.register(server, context);
		}
		return server;
	}
}
