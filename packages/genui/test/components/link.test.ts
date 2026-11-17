import { describe, expect, it } from "vitest";
import { Link, MAX_LABEL_LENGTH } from "../../src/components/link";

const HTTPS_URL = "https://example.com";

const accepts = (label: string, url: string) => {
	return Link.props.safeParse({ label, url }).success;
};

describe("Link component", () => {
	it("RULE-LINK-001: A `Link` url must be https", () => {
		const urls = ["http://example.com", "javascript:alert(1)", "example.com"];

		for (const url of urls) {
			const valid = accepts("Site", url);

			expect(valid).toBe(false);
		}
	});

	it("RULE-LINK-002: An empty label is invalid", () => {
		const valid = accepts("", HTTPS_URL);

		expect(valid).toBe(false);
	});

	it("RULE-LINK-003: A label longer than 40 characters is invalid", () => {
		const tooLong = "x".repeat(MAX_LABEL_LENGTH + 1);

		const valid = accepts(tooLong, HTTPS_URL);

		expect(valid).toBe(false);
	});
});
