import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { inject, injectable } from "inversify";
import type { McpTool } from "~/infrastructure/http/index";
import { NewFeedbackSchema } from "../application/feedback.dto";
import { FeedbackService } from "../application/feedback.service";

@injectable()
export class FeedbackTool implements McpTool {
	constructor(
		@inject(FeedbackService) private readonly service: FeedbackService,
	) {}

	register(server: McpServer): void {
		server.registerTool(
			"submit_feedback",
			{
				description: "Leave a freeform message for the site owner.",
				inputSchema: NewFeedbackSchema.shape,
			},
			async (args) => {
				await this.service.submit(args);

				return {
					content: [{ type: "text", text: "Thanks for the feedback." }],
				};
			},
		);
	}
}
