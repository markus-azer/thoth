import { describe, expect, it } from "vitest";
import { MAX_CHILDREN, Stack } from "../../src/components/stack";

const suggestions = { questions: ["Q?"] };

const accepts = (children: unknown[]) => {
	return Stack.props.safeParse({ children }).success;
};

describe("Stack component", () => {
	it("RULE-STACK-001: A `Stack` with no children is invalid", () => {
		const valid = accepts([]);

		expect(valid).toBe(false);
	});

	it("RULE-STACK-002: A `Stack` with more than 6 children is invalid", () => {
		const children = Array.from(
			{ length: MAX_CHILDREN + 1 },
			() => suggestions,
		);

		const valid = accepts(children);

		expect(valid).toBe(false);
	});

	it("RULE-STACK-003: A `Stack` can only hold a `Suggestions` or a `Link`", () => {
		const innerStack = { children: [suggestions] };

		const valid = accepts([innerStack]);

		expect(valid).toBe(false);
	});
});
