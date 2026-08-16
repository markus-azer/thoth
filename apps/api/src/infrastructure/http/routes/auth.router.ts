import { Router } from "express";
import { inject, injectable } from "inversify";
import { AuthController } from "~/modules/auth/index";

const BASE_PATH = "/api/auth";

@injectable()
export class AuthRouter {
	constructor(
		@inject(AuthController) private readonly controller: AuthController,
	) {}

	// Root mount: the catch-all must run before express.json().
	get routes(): Router {
		const router = Router();

		router.all(`${BASE_PATH}/*splat`, this.controller.handle);

		// MCP clients read this at the root.
		router.get(
			"/.well-known/oauth-protected-resource",
			this.controller.protectedResourceMetadata,
		);

		// Claude probes the root, so serve both root and RFC 8414 path.
		router.get(
			[
				"/.well-known/oauth-authorization-server",
				`/.well-known/oauth-authorization-server${BASE_PATH}`,
			],
			this.controller.oauthServerConfig,
		);

		router.get("/auth/sign-in", this.controller.signIn);
		router.get("/auth/consent", this.controller.consent);

		return router;
	}
}
