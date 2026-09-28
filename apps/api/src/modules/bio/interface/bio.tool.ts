import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { inject, injectable } from "inversify";
import type { McpRequestContext, McpTool } from "~/infrastructure/http/index";
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
}
