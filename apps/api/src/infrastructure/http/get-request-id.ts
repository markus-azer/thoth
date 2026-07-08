import type { Response } from "express";

export const getRequestId = (res: Response): string | undefined => {
	const id = res.getHeader("x-request-id");
	return typeof id === "string" ? id : undefined;
};
