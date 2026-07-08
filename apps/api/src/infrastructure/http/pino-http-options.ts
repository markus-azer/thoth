import type { IncomingMessage, ServerResponse } from "node:http";
import { pinoInstance } from "~/logger";

// Reuses the id requestContext sets on the response.
export const pinoHttpOptions = {
	logger: pinoInstance,
	genReqId: (_req: IncomingMessage, res: ServerResponse) => {
		const id = res.getHeader("x-request-id");
		return typeof id === "string" ? id : "";
	},
};
