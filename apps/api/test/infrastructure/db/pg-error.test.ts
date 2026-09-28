import { describe, expect, it } from "vitest";
import { isUniqueViolation } from "~/infrastructure/db/index";

describe("isUniqueViolation", () => {
	it("is true for a unique violation on the named constraint", () => {
		const err = { code: "23505", constraint: "bio_handle_key" };

		expect(isUniqueViolation(err, "bio_handle_key")).toBe(true);
	});

	it("is false for a unique violation on a different constraint", () => {
		const err = { code: "23505", constraint: "bio_pkey" };

		expect(isUniqueViolation(err, "bio_handle_key")).toBe(false);
	});

	it("is false for a non-unique-violation error code", () => {
		const err = { code: "23503", constraint: "bio_handle_key" };

		expect(isUniqueViolation(err, "bio_handle_key")).toBe(false);
	});

	it("is false for a value that isn't a Postgres error", () => {
		expect(isUniqueViolation(new Error("boom"), "bio_handle_key")).toBe(false);
	});
});
