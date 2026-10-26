import { describe, expect, it } from "vitest";
import { HandleSchema } from "../src/handle";

describe("HandleSchema", () => {
	it.each(["markus-azer", "a", "a1", "42"])("accepts %s", (handle) => {
		const result = HandleSchema.safeParse(handle);

		expect(result.success).toBe(true);
	});

	it.each(["Alice", "_alice", "-alice", "alice-", "a b", "", "  "])(
		"rejects %j",
		(handle) => {
			const result = HandleSchema.safeParse(handle);

			expect(result.success).toBe(false);
		},
	);

	it("rejects a handle longer than 60 characters", () => {
		const result = HandleSchema.safeParse("a".repeat(61));

		expect(result.success).toBe(false);
	});

	it("trims the handle", () => {
		const result = HandleSchema.parse(" markus-azer ");

		expect(result).toBe("markus-azer");
	});
});
