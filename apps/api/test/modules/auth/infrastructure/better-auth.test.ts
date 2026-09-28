import "reflect-metadata";
import { describe, expect, it } from "vitest";
import type { Pool } from "~/infrastructure/db/index";
import {
	authIssuer,
	createAuth,
} from "~/modules/auth/infrastructure/better-auth";

// Enough of a pool for the adapter to initialise. Nothing queries.
const pool = {
	query: async () => ({ rows: [], rowCount: 0 }),
	connect: async () => ({ query: async () => ({ rows: [] }), release() {} }),
	end: async () => {},
	on: () => {},
} as unknown as Pool;

const auth = createAuth(pool);
const { baseURL } = await auth.$context;

// Tokens are signed against the mounted url and verified against these
// constants. When they drift apart, every bearer fails with a bare 401.
describe("createAuth", () => {
	it("mounts auth where the issuer says it is", () => {
		expect(authIssuer).toBe(baseURL);
	});

	it("keeps jwks under the base path", () => {
		expect(`${auth.options.baseURL}${auth.options.basePath}`).toBe(baseURL);
	});
});
