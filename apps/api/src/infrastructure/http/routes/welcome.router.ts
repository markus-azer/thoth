import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class WelcomeRouter {
	get routes(): Router {
		const router = Router();

		router.get("/", (_req, res) => {
			res.json({
				name: "@thoth/api",
				status: "ok",
			});
		});

		return router;
	}
}
