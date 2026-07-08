import type { IncomingMessage, ServerResponse } from "node:http";
import { v7 as uuidv7 } from "uuid";
import { log, pinoInstance } from "~/logger";

// Accepts any common ID format: UUID, ULID, KSUID, NanoID. Capped to prevent log bloat.
const VALID_REQ_ID = /^[A-Za-z0-9_-]{1,128}$/;

const isString = (value: unknown): value is string => typeof value === "string";

export const pinoHttpOptions = {
	logger: pinoInstance,
	genReqId: (req: IncomingMessage, res: ServerResponse) => {
		const raw = req.headers["x-request-id"];
		const valid = isString(raw) && VALID_REQ_ID.test(raw);

		if (isString(raw) && !valid) {
			log.debug("Invalid x-request-id, generating new", {
				rejected: raw.slice(0, 200),
			});
		}

		const id = valid ? raw : uuidv7();
		res.setHeader("x-request-id", id);
		return id;
	},
};
