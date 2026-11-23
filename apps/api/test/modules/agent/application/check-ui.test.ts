import { describe, expect, it } from "vitest";
import { uiProblems } from "~/modules/agent/application/graph/check-ui";

const URL = "https://example.com/a";
const link = (url: string) =>
	`root = Stack([a])\na = Link("example.com", "${url}")`;

describe("uiProblems", () => {
	it("accepts a link to a URL in the answer", () => {
		expect(uiProblems(link(URL), `See ${URL}`)).toEqual([]);
	});

	it("ignores punctuation after the URL in the answer", () => {
		expect(uiProblems(link(URL), `See ${URL}.`)).toEqual([]);
	});

	it("flags a link to a URL that is not in the answer", () => {
		const problems = uiProblems(link("https://evil.example/x"), `See ${URL}`);

		expect(problems).toEqual([
			"The link https://evil.example/x is not in the answer.",
		]);
	});

	it("reports the program's own problems", () => {
		expect(uiProblems("not a program", "hi")).not.toEqual([]);
	});
});
