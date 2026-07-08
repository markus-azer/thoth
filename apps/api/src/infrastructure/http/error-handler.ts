import { AppError } from "@wadjet/utils";
import type { ErrorRequestHandler } from "express";
import { log } from "~/logger";
import { getRequestId } from "./get-request-id";

const logErr = (err: AppError): void => {
	const ctx = { err, code: err.code };
	if (err.isServerError) {
		log.error("Request failed", ctx);
		return;
	}
	log.warn("Request failed", ctx);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	const appErr = AppError.from(err);

	logErr(appErr);

	res.status(appErr.status).json({
		code: appErr.code,
		message: appErr.message,
		status: appErr.status,
		requestId: getRequestId(res),
		...(appErr.fieldErrors && { fieldErrors: appErr.fieldErrors }),
	});
};
