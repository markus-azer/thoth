import { AppError } from "@thoth/utils";
import type { ErrorRequestHandler } from "express";
import { log } from "~/logger";
import { getRequestId } from "./get-request-id";

const logErr = (appErr: AppError, original: unknown): void => {
	if (appErr.isServerError) {
		// Log the raw throw. AppError.from() masks unknown errors as a 500.
		log.error("Request failed", { err: original, code: appErr.code });
		return;
	}
	log.warn("Request failed", { err: appErr, code: appErr.code });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	const appErr = AppError.from(err);

	logErr(appErr, err);

	res.status(appErr.status).json({
		code: appErr.code,
		message: appErr.message,
		status: appErr.status,
		requestId: getRequestId(res),
		...(appErr.fieldErrors && { fieldErrors: appErr.fieldErrors }),
	});
};
