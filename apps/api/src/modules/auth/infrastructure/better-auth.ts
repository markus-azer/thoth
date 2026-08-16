import { oauthProvider } from "@better-auth/oauth-provider";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import type { Pool } from "pg";
import { env } from "~/env";

// DI token for the Better Auth instance.
export const Auth = Symbol("Auth");

export function createAuth(pool: Pool) {
	return betterAuth({
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		database: pool,
		socialProviders: {
			github: {
				clientId: env.GITHUB_CLIENT_ID,
				clientSecret: env.GITHUB_CLIENT_SECRET,
			},
		},
		plugins: [
			jwt(),
			oauthProvider({
				loginPage: "/auth/sign-in",
				consentPage: "/auth/consent",
				// The MCP resource is this origin, with a trailing slash. The default
				// audience is the /api/auth path, which it won't match.
				validAudiences: [env.BETTER_AUTH_URL, `${env.BETTER_AUTH_URL}/`],
				allowDynamicClientRegistration: true,
				// MCP clients register without credentials. Slated for deprecation upstream.
				allowUnauthenticatedClientRegistration: true,
			}),
		],
	});
}

export type Auth = ReturnType<typeof createAuth>;
