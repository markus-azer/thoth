import { oauthProviderResourceClient } from "@better-auth/oauth-provider/resource-client";
import { toNodeHandler } from "better-auth/node";
import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { env } from "~/env";
import { Auth } from "../infrastructure/better-auth";
import { CONSENT_PAGE, SIGN_IN_PAGE } from "./auth.pages";

const BASE_PATH = "/api/auth";
const AUTH_SERVER = `${env.BETTER_AUTH_URL}${BASE_PATH}`;

// The stub pages use inline script and style. Nonce them once the real frontend lands.
const PAGE_CSP =
	"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'";

@injectable()
export class AuthController {
	private readonly resourceClient: ReturnType<
		typeof AuthController.buildResourceClient
	>;

	// Mounts before express.json() so Better Auth sees the raw body.
	readonly handle: ReturnType<typeof toNodeHandler>;

	constructor(@inject(Auth) private readonly auth: Auth) {
		this.resourceClient = AuthController.buildResourceClient(auth);
		this.handle = toNodeHandler(auth);
	}

	private static buildResourceClient(auth: Auth) {
		return oauthProviderResourceClient(auth).getActions();
	}

	// The plugin drops the basePath from the issuer, so pass the full server.
	protectedResourceMetadata = async (
		_req: Request,
		res: Response,
	): Promise<void> => {
		const metadata = await this.resourceClient.getProtectedResourceMetadata({
			authorization_servers: [AUTH_SERVER],
		});
		res.json(metadata);
	};

	oauthServerConfig = async (_req: Request, res: Response): Promise<void> => {
		const config = await this.auth.api.getOAuthServerConfig();
		res.json(config);
	};

	signIn = (_req: Request, res: Response): void => {
		res
			.type("html")
			.set("Content-Security-Policy", PAGE_CSP)
			.send(SIGN_IN_PAGE);
	};

	consent = (_req: Request, res: Response): void => {
		res
			.type("html")
			.set("Content-Security-Policy", PAGE_CSP)
			.send(CONSENT_PAGE);
	};
}
