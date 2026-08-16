import { oauthProviderResourceClient } from "@better-auth/oauth-provider/resource-client";
import { APIError } from "better-auth/api";
import { inject, injectable } from "inversify";
import { log } from "~/logger";
import type { AuthPort } from "../application/auth.port";
import type { Principal } from "../domain/principal";
import { Auth } from "./better-auth";

@injectable()
export class BetterAuthVerifier implements AuthPort {
	// Built once. Runs on every private tool call.
	private readonly resourceClient: ReturnType<
		typeof BetterAuthVerifier.buildResourceClient
	>;

	constructor(@inject(Auth) auth: Auth) {
		this.resourceClient = BetterAuthVerifier.buildResourceClient(auth);
	}

	private static buildResourceClient(auth: Auth) {
		return oauthProviderResourceClient(auth).getActions();
	}

	async verifyBearer(token: string): Promise<Principal | undefined> {
		try {
			// audience, issuer and jwksUrl are derived from the auth config.
			const payload = await this.resourceClient.verifyAccessToken(token);
			if (typeof payload.sub !== "string") return undefined;

			const userId = payload.sub;
			const { scope } = payload;
			const scopes = typeof scope === "string" ? scope.split(" ") : [];

			return { userId, scopes };
		} catch (err) {
			// Quiet on routine token failures, warn on the unexpected.
			if (err instanceof APIError && err.status === "UNAUTHORIZED") {
				return undefined;
			}

			log.warn("bearer verification failed unexpectedly", { err });
			return undefined;
		}
	}
}
