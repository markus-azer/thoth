import { withRequestId } from "@wadjet/utils";
import type { RequestHandler } from "express";
import { v7 as uuidv7 } from "uuid";

// Accepts any common ID format: UUID, ULID, KSUID, NanoID. Capped to prevent log bloat.
const VALID_REQ_ID = /^[A-Za-z0-9_-]{1,128}$/;

export const requestContext: RequestHandler = (req, res, next) => {
	const raw = req.headers["x-request-id"];
	const id = typeof raw === "string" && VALID_REQ_ID.test(raw) ? raw : uuidv7();
	res.setHeader("x-request-id", id);
	withRequestId(id, next);
};
