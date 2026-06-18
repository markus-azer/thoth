import { describe, expect, it } from "vitest";
import { withTimeout } from "../src/withTimeout";

describe("withTimeout", () => {
	it("resolves with the value when the promise completes in time", async () => {
		const result = await withTimeout(Promise.resolve(42), 100, "fast");
		expect(result).toBe(42);
	});

	it("rejects with a labeled timeout error when the promise is too slow", async () => {
		const slow = new Promise<number>((resolve) => {
			setTimeout(() => resolve(1), 100);
		});
		await expect(withTimeout(slow, 10, "slow op")).rejects.toThrow(
			"slow op timeout after 10ms",
		);
	});
});
