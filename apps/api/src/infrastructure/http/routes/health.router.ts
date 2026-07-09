import { Router } from "express";
import { inject, injectable } from "inversify";
import {
	HealthController,
	LiveStatusSchema,
	ReadyStatusSchema,
} from "~/modules/health/index";
import { registry } from "../openapi/registry";

@injectable()
export class HealthRouter {
	constructor(
		@inject(HealthController) private readonly controller: HealthController,
	) {}

	// Side-effect: registers schemas into the OpenAPI registry. Call once.
	get routes(): Router {
		const router = Router();

		router.get("/live", this.controller.live);
		registry.register("LiveStatus", LiveStatusSchema);
		registry.registerPath({
			method: "get",
			path: "/health/live",
			summary: "Liveness check",
			tags: ["Health"],
			responses: {
				200: {
					description: "Process is alive.",
					content: { "application/json": { schema: LiveStatusSchema } },
				},
			},
		});

		router.get("/ready", this.controller.ready);
		registry.register("ReadyStatus", ReadyStatusSchema);
		registry.registerPath({
			method: "get",
			path: "/health/ready",
			summary: "Readiness check",
			tags: ["Health"],
			responses: {
				200: {
					description: "Service is ready.",
					content: { "application/json": { schema: ReadyStatusSchema } },
				},
				503: {
					description: "Service is not ready.",
					content: { "application/json": { schema: ReadyStatusSchema } },
				},
			},
		});

		return router;
	}
}
