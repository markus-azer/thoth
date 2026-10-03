import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { inject, injectable } from "inversify";
import type { McpRequestContext, McpTool } from "~/infrastructure/mcp/index";
import { BioInputSchema } from "../application/bio.dto";
import { BioService } from "../application/bio.service";
import type { Bio } from "../domain/bio";

@injectable()
export class BioTool implements McpTool {
	constructor(@inject(BioService) private readonly service: BioService) {}

	register(server: McpServer, context: McpRequestContext): void {
		server.registerTool(
			"get_bio",
			{
				description: "Who a handle's bio is about: name, headline, and about.",
			},
			async () => {
				const bio = await this.service.get(context.identifier);
				return this.reply(bio);
			},
		);

		server.registerTool(
			"create_bio",
			{
				description: "Create the caller's own bio.",
				inputSchema: BioInputSchema.shape,
			},
			async (args) => {
				const bio = await this.service.create(this.callerId(context), args);
				return this.reply(bio);
			},
		);

		server.registerTool(
			"update_bio",
			{
				description: "Update the caller's own bio.",
				inputSchema: BioInputSchema.shape,
			},
			async (args) => {
				const bio = await this.service.update(this.callerId(context), args);
				return this.reply(bio);
			},
		);
	}

	private reply(bio: Bio) {
		return {
			content: [
				{
					type: "text" as const,
					text: `${bio.name} - ${bio.headline}\n\n${bio.about}`,
				},
			],
		};
	}

	// PrivateToolNames gates the write tools: only a verified bearer reaches here.
	private callerId(context: McpRequestContext): string {
		if (!context.principal) {
			throw new Error("writing a bio requires a verified principal");
		}

		return context.principal.userId;
	}
}
