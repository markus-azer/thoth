import { withRequestId } from "@wadjet/utils";
import type { RequestHandler } from "express";
import { getRequestId } from "./get-request-id";

export const requestContext: RequestHandler = (_req, res, next) => {
	withRequestId(getRequestId(res) ?? "", next);
};
