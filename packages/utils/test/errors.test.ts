import { describe, expect, it } from "vitest";
import {
	AppError,
	BadRequest,
	Conflict,
	ErrorCode,
	Forbidden,
	NotFound,
	Unauthorized,
	UnprocessableEntity,
} from "../src";

describe("errors", () => {
	it("RULE-ERRORS-001: `BadRequest` sets status 400", () => {
		const err = new BadRequest(ErrorCode.INTERNAL_ERROR, "bad");
		expect(err.status).toBe(400);
	});

	it("RULE-ERRORS-002: `Unauthorized` sets status 401", () => {
		const err = new Unauthorized(ErrorCode.INTERNAL_ERROR, "nope");
		expect(err.status).toBe(401);
	});

	it("RULE-ERRORS-003: `Forbidden` sets status 403", () => {
		const err = new Forbidden(ErrorCode.INTERNAL_ERROR, "nope");
		expect(err.status).toBe(403);
	});

	it("RULE-ERRORS-004: `NotFound` sets status 404", () => {
		const err = new NotFound(ErrorCode.INTERNAL_ERROR, "gone");
		expect(err.status).toBe(404);
	});

	it("RULE-ERRORS-005: `Conflict` sets status 409", () => {
		const err = new Conflict(ErrorCode.INTERNAL_ERROR, "clash");
		expect(err.status).toBe(409);
	});

	it("RULE-ERRORS-006: `UnprocessableEntity` sets status 422", () => {
		const err = new UnprocessableEntity(ErrorCode.INTERNAL_ERROR, "invalid");
		expect(err.status).toBe(422);
	});

	it("RULE-ERRORS-007: `AppError.from` returns the same instance when given an `AppError`", () => {
		const original = new NotFound(ErrorCode.INTERNAL_ERROR, "gone");
		expect(AppError.from(original)).toBe(original);
	});

	it("RULE-ERRORS-008: `AppError.from` returns a 500 `INTERNAL_ERROR` for unknown values", () => {
		const err = AppError.from(new Error("boom"));
		expect(err.status).toBe(500);
		expect(err.code).toBe(ErrorCode.INTERNAL_ERROR);
	});

	it("RULE-ERRORS-009: `isServerError` is true when status is 500 or greater", () => {
		const server = new AppError(ErrorCode.INTERNAL_ERROR, 500, "boom");
		const client = new NotFound(ErrorCode.INTERNAL_ERROR, "gone");
		expect(server.isServerError).toBe(true);
		expect(client.isServerError).toBe(false);
	});

	it("RULE-ERRORS-010: `fieldErrors` is optional and carried through when provided", () => {
		const withFields = new BadRequest(ErrorCode.INTERNAL_ERROR, "bad", [
			{ field: "email", code: ErrorCode.INTERNAL_ERROR, message: "required" },
		]);
		const without = new BadRequest(ErrorCode.INTERNAL_ERROR, "bad");
		expect(withFields.fieldErrors).toHaveLength(1);
		expect(without.fieldErrors).toBeUndefined();
	});
});
