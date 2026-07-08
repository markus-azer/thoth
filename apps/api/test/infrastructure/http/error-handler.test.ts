import { AppError, ErrorCode } from "@wadjet/utils";
import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { errorHandler } from "~/infrastructure/http/error-handler";

const appWith = (err: unknown) => {
	const app = express();
	app.get("/boom", (_req, _res, next) => next(err));
	app.use(errorHandler);
	return app;
};

describe("errorHandler", () => {
	it("maps AppError to its status and code", async () => {
		const err = new AppError(ErrorCode.INTERNAL_ERROR, 400, "bad");
		const res = await request(appWith(err)).get("/boom");
		expect(res.status).toBe(400);
		expect(res.body).toMatchObject({
			code: ErrorCode.INTERNAL_ERROR,
			status: 400,
			message: "bad",
		});
	});

	it("wraps unknown errors as 500", async () => {
		const res = await request(appWith(new Error("boom"))).get("/boom");
		expect(res.status).toBe(500);
	});
});
