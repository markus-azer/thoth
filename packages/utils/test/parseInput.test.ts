import { describe, expect, it } from "vitest";
import { ErrorCode } from "../src/error-codes";
import { parseInput } from "../src/parseInput";
import { z } from "../src/zod";

const schema = z.object({ message: z.string().trim().min(1) });

describe("parseInput", () => {
	it("returns the parsed data when the input is valid", () => {
		const result = parseInput(schema, { message: " hi " });

		expect(result).toEqual({ message: "hi" });
	});

	it("throws a 400 BadRequest with code INVALID_REQUEST when the input is invalid", () => {
		const parse = () => parseInput(schema, { message: " " });

		expect(parse).toThrow(
			expect.objectContaining({
				code: ErrorCode.INVALID_REQUEST,
				status: 400,
			}),
		);
	});

	it("names the invalid field in the message", () => {
		const parse = () => parseInput(schema, {});

		expect(parse).toThrow(/message/);
	});
});
