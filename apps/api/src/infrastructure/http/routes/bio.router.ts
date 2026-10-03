import { Router } from "express";
import { inject, injectable } from "inversify";
import {
	BioController,
	BioOutputSchema,
	BioParamsSchema,
} from "~/modules/bio/index";
import { registry } from "../openapi/registry";

@injectable()
export class BioRouter {
	constructor(
		@inject(BioController) private readonly controller: BioController,
	) {}

	// Side-effect: registers schemas into the OpenAPI registry. Call once.
	get routes(): Router {
		const router = Router();

		router.get("/:handle", this.controller.get);
		registry.register("Bio", BioOutputSchema);
		registry.registerPath({
			method: "get",
			path: "/bio/{handle}",
			summary: "Get a bio by handle",
			tags: ["Bio"],
			request: { params: BioParamsSchema },
			responses: {
				200: {
					description: "The bio.",
					content: { "application/json": { schema: BioOutputSchema } },
				},
				404: { description: "No bio for that handle." },
			},
		});

		return router;
	}
}
