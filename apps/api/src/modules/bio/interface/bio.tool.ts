import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { inject, injectable } from "inversify";
import type { McpTool } from "~/infrastructure/http/index";
import { BioService } from "../application/bio.service";
import type { Bio } from "../domain/bio";

const formatBio = (bio: Bio): string =>
	`${bio.name} - ${bio.headline}\n\n${bio.about}`;

@injectable()
export class BioTool implements McpTool {
	constructor(@inject(BioService) private readonly service: BioService) {}

	register(server: McpServer): void {
		server.registerTool(
			"get_bio",
			{
				description: "Who this site is about: name, headline, and about.",
			},
			async () => {
				const bio = await this.service.get();
				return {
					content: [{ type: "text", text: formatBio(bio) }],
				};
			},
		);
	}
}
