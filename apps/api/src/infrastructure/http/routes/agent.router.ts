import { Router } from "express";
import { inject, injectable } from "inversify";
import {
	AgentController,
	AskBodySchema,
	AskParamsSchema,
	CreateThreadInputSchema,
	ReplyOutputSchema,
	ThreadOutputSchema,
} from "~/modules/agent/index";
import { registry } from "../openapi/registry";

@injectable()
export class AgentRouter {
	constructor(
		@inject(AgentController) private readonly controller: AgentController,
	) {}

	// Side-effect: registers schemas into the OpenAPI registry. Call once.
	get routes(): Router {
		const router = Router();

		router.post("/", this.controller.createThread);
		registry.register("Thread", ThreadOutputSchema);
		registry.registerPath({
			method: "post",
			path: "/threads",
			summary: "Start a thread about a bio",
			tags: ["Agent"],
			request: {
				body: {
					required: true,
					content: {
						"application/json": { schema: CreateThreadInputSchema },
					},
				},
			},
			responses: {
				201: {
					description: "The new thread.",
					content: { "application/json": { schema: ThreadOutputSchema } },
				},
				400: { description: "The request is invalid." },
				404: { description: "No bio for that handle." },
			},
		});

		router.post("/:threadId/messages", this.controller.ask);
		registry.register("Reply", ReplyOutputSchema);
		registry.registerPath({
			method: "post",
			path: "/threads/{threadId}/messages",
			summary: "Ask the agent in a thread",
			tags: ["Agent"],
			request: {
				params: AskParamsSchema,
				body: {
					required: true,
					content: { "application/json": { schema: AskBodySchema } },
				},
			},
			responses: {
				200: {
					description: "The agent's reply.",
					content: { "application/json": { schema: ReplyOutputSchema } },
				},
				400: { description: "The request is invalid." },
				404: { description: "No thread for that id." },
				502: { description: "The model returned an empty reply." },
			},
		});

		return router;
	}
}
