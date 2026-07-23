import "reflect-metadata";
import { describe, expect, it } from "vitest";
import { UuidGenerator } from "../src/id/uuid-generator";

describe("UuidGenerator", () => {
	it("generates a fresh id on each call", () => {
		const ids = new UuidGenerator();
		const a = ids.next();
		const b = ids.next();

		expect(a).not.toBe(b);
		expect(a).not.toHaveLength(0);
	});
});
