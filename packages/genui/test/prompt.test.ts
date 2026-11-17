import { describe, expect, it } from "vitest";
import { GENUI_COMPONENTS } from "../src/components/index";
import { genuiPrompt } from "../src/index";

describe("generated UI prompt", () => {
	it("RULE-PROMPT-001: The prompt lists every library component", () => {
		const prompt = genuiPrompt({ preamble: "Write UI.", examples: [] });

		for (const { name } of GENUI_COMPONENTS) {
			expect(prompt).toContain(`${name}(`);
		}
	});

	it("RULE-PROMPT-002: The prompt includes the given preamble", () => {
		const prompt = genuiPrompt({ preamble: "Write tiny UI.", examples: [] });

		expect(prompt).toContain("Write tiny UI.");
	});

	it("RULE-PROMPT-003: The prompt includes the given examples", () => {
		const example = 'root = Stack([next])\nnext = Suggestions(["Hi?"])';

		const prompt = genuiPrompt({ preamble: "Write UI.", examples: [example] });

		expect(prompt).toContain(example);
	});
});
