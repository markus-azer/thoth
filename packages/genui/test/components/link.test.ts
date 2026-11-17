import { describe, expect, it } from "vitest";
import { Link, MAX_LABEL_LENGTH } from "../../src/components/link";

const HTTPS_URL = "https://example.com";

const accepts = (label: string, url: string) => {
	return Link.props.safeParse({ label, url }).success;
};

describe("Link component", () => {
	it("accepts a short label and an https url", () => {
		const valid = accepts("Site", HTTPS_URL);

		expect(valid).toBe(true);
	});

	it("accepts a label of the longest length it allows", () => {
		const longest = "x".repeat(MAX_LABEL_LENGTH);

		const valid = accepts(longest, HTTPS_URL);

		expect(valid).toBe(true);
	});

	it("RULE-LINK-001: A `Link` url must be https", () => {
		const urls = ["http://example.com", "javascript:alert(1)", "example.com"];

		for (const url of urls) {
			const valid = accepts("Site", url);

			expect(valid).toBe(false);
		}
	});

	it("RULE-LINK-002: An empty or blank label is invalid", () => {
		const labels = ["", "   "];

		for (const label of labels) {
			const valid = accepts(label, HTTPS_URL);

			expect(valid).toBe(false);
		}
	});

	it("RULE-LINK-003: A label longer than 40 characters is invalid", () => {
		const tooLong = "x".repeat(MAX_LABEL_LENGTH + 1);

		const valid = accepts(tooLong, HTTPS_URL);

		expect(valid).toBe(false);
	});
});
