import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { inject, injectable } from "inversify";
import type { McpRequestContext, McpTool } from "~/infrastructure/mcp/index";
import { QueryInputSchema } from "../application/query.dto";
import { QueryRunner } from "../application/query.runner";

@injectable()
export class QueryTool implements McpTool {
	constructor(@inject(QueryRunner) private readonly runner: QueryRunner) {}

	register(server: McpServer, context: McpRequestContext): void {
		server.registerTool(
			"query",
			{
				// TODO: Need scalable solution: research ontology or pg descriptions.
				description:
					"Run one read-only Postgres SELECT over the caller's own data. Tables: feedback (id, message, name, topic, email, created_at).",
				inputSchema: QueryInputSchema.shape,
			},
			async ({ sql }) => {
				const userId = this.callerId(context);
				const rows = await this.runner.run(userId, sql);

				return {
					content: [{ type: "text", text: JSON.stringify(rows) }],
				};
			},
		);
	}

	// PrivateToolNames gates this tool: only a verified bearer reaches here.
	private callerId(context: McpRequestContext): string {
		if (!context.principal) {
			throw new Error("querying requires a verified principal");
		}

		return context.principal.userId;
	}
}
