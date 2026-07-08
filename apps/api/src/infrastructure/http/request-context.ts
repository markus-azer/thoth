import { withRequestId } from "@wadjet/utils";
import type { RequestHandler } from "express";
import { getRequestId } from "./get-request-id";

export const requestContext: RequestHandler = (_req, res, next) => {
	const id = getRequestId(res);
	if (!id) {
		next();
		return;
	}
	withRequestId(id, next);
};
