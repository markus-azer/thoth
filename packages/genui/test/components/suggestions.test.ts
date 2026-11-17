import { describe, expect, it } from "vitest";
import {
	MAX_QUESTION_LENGTH,
	MAX_QUESTIONS,
	Suggestions,
} from "../../src/components/suggestions";

const accepts = (questions: string[]) => {
	return Suggestions.props.safeParse({ questions }).success;
};

describe("Suggestions component", () => {
	it("accepts the most questions it allows", () => {
		const questions = Array.from({ length: MAX_QUESTIONS }, () => "Q?");

		const valid = accepts(questions);

		expect(valid).toBe(true);
	});

	it("accepts a question of the longest length it allows", () => {
		const longest = "x".repeat(MAX_QUESTION_LENGTH);

		const valid = accepts([longest]);

		expect(valid).toBe(true);
	});

	it("RULE-SUGGESTIONS-001: A `Suggestions` with no questions is invalid", () => {
		const valid = accepts([]);

		expect(valid).toBe(false);
	});

	it("RULE-SUGGESTIONS-002: A `Suggestions` with more than 4 questions is invalid", () => {
		const questions = Array.from({ length: MAX_QUESTIONS + 1 }, () => "Q?");

		const valid = accepts(questions);

		expect(valid).toBe(false);
	});

	it("RULE-SUGGESTIONS-003: An empty or blank question is invalid", () => {
		const questions = ["", "   "];

		for (const question of questions) {
			const valid = accepts([question]);

			expect(valid).toBe(false);
		}
	});

	it("RULE-SUGGESTIONS-004: A question longer than 80 characters is invalid", () => {
		const tooLong = "x".repeat(MAX_QUESTION_LENGTH + 1);

		const valid = accepts([tooLong]);

		expect(valid).toBe(false);
	});
});
