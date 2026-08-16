import type { Request, RequestHandler } from "express";

const BEARER_PREFIX = "Bearer ";

// A JSON-RPC body is one message or a batch array. Collect every tools/call
// name so a private tool hidden inside a batch still gets gated.
const calledTools = (body: unknown): string[] =>
	(Array.isArray(body) ? body : [body])
		.map((m) => m as { method?: string; params?: { name?: string } })
		.filter((m) => m.method === "tools/call")
		.map((m) => m.params?.name)
		.filter((name): name is string => !!name);

const bearerToken = (req: Request): string | undefined => {
	const header = req.headers.authorization;
	return header?.startsWith(BEARER_PREFIX)
		? header.slice(BEARER_PREFIX.length)
		: undefined;
};

// Gates private MCP tools: a tools/call for a private tool without a valid
// bearer gets 401, so the client runs the sign-in flow and retries. Every
// other request passes through, keeping public tools anonymous.
export const mcpAuthMiddleware = (
	verify: (token: string) => Promise<unknown>,
	privateTools: Set<string>,
	resourceMetadataUrl: string,
): RequestHandler => {
	return async (req, res, next) => {
		const gated = calledTools(req.body).some((name) => privateTools.has(name));
		if (!gated) return next();

		const token = bearerToken(req);
		const principal = token ? await verify(token) : undefined;
		if (principal) return next();

		res
			.status(401)
			.set(
				"WWW-Authenticate",
				`Bearer resource_metadata="${resourceMetadataUrl}"`,
			)
			.json({ error: "unauthorized" });
	};
};
