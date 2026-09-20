import type { Request, RequestHandler } from "express";
import type { McpPrincipal } from "./mcp";

// A JSON-RPC body is one message or a batch array. Collect every tools/call
// name so a private tool hidden inside a batch still gets gated.
const calledTools = (body: unknown): string[] =>
	(Array.isArray(body) ? body : [body])
		.map((m) => m as { method?: string; params?: { name?: string } })
		// Guards an unparsed body and a nullish entry, both undefined here.
		.filter((m) => m?.method === "tools/call")
		.map((m) => m.params?.name)
		.filter((name): name is string => !!name);

// Bearer scheme is case-insensitive (RFC 6750).
const bearerToken = (req: Request): string | undefined =>
	req.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];

// True for `/mcp/:identifier`, false for bare `/mcp`. Relies on this
// middleware being mounted at the `/mcp` prefix, so `req.path` is stripped.
const hasIdentifier = (req: Request): boolean => req.path !== "/";

export const mcpAuthMiddleware = (
	verify: (token: string) => Promise<McpPrincipal | undefined>,
	privateTools: Set<string>,
	resourceMetadataUrl: string,
): RequestHandler => {
	return async (req, res, next) => {
		const gated = calledTools(req.body).some((name) => privateTools.has(name));
		// Public tools stay anonymous. Only a private tool call needs a bearer.
		if (!gated) return next();

		// Public-read-only mount: a private tool call here gets 404, not 401.
		// It shouldn't even reveal that auth was missing.
		if (hasIdentifier(req)) {
			res.status(404).json({ error: "not_found" });
			return;
		}

		const token = bearerToken(req);
		const principal = token ? await verify(token) : undefined;
		if (principal) {
			res.locals["principal"] = principal;
			return next();
		}

		// No valid bearer: 401 so the client can sign in and retry.
		res
			.status(401)
			.set(
				"WWW-Authenticate",
				`Bearer resource_metadata="${resourceMetadataUrl}"`,
			)
			.json({ error: "unauthorized" });
	};
};
