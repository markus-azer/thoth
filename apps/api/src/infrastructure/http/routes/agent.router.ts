import { Router } from "express";
import { inject, injectable } from "inversify";
import { AgentController } from "~/modules/agent/index";

@injectable()
export class AgentRouter {
	constructor(
		@inject(AgentController) private readonly controller: AgentController,
	) {}

	get routes(): Router {
		const router = Router();

		router.post("/", this.controller.createThread);
		router.post("/:threadId/messages", this.controller.ask);

		return router;
	}
}
