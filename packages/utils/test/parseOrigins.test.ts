import { describe, expect, it } from "vitest";
import { parseOrigins } from "../src/parseOrigins";

describe("parseOrigins", () => {
	it('RULE-ORIGINS-001: `"*"` returns `true` (allow any origin)', () => {
		expect(parseOrigins("*")).toBe(true);
	});

	it("RULE-ORIGINS-002: A comma-separated string is split into trimmed origins", () => {
		expect(
			parseOrigins("https://a.com, https://b.com , https://c.com"),
		).toEqual(["https://a.com", "https://b.com", "https://c.com"]);
	});
});
