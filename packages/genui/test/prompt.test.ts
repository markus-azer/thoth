import { describe, expect, it } from "vitest";
import { GENUI_COMPONENTS } from "../src/components/index";
import { GENUI_EXAMPLE, genuiPrompt } from "../src/index";

const MIN_DESCRIPTION = 20;

describe("generated UI prompt", () => {
	it("RULE-PROMPT-001: The prompt lists every library component", () => {
		const prompt = genuiPrompt("Write UI.");

		for (const { name } of GENUI_COMPONENTS) {
			expect(prompt).toContain(`${name}(`);
		}
	});

	it("RULE-PROMPT-002: The prompt includes the given preamble", () => {
		const prompt = genuiPrompt("Write tiny UI.");

		expect(prompt).toContain("Write tiny UI.");
	});

	it("RULE-PROMPT-003: The prompt includes the package example", () => {
		const prompt = genuiPrompt("Write UI.");

		expect(prompt).toContain(GENUI_EXAMPLE);
	});

	it("RULE-PROMPT-004: Every library component says when to use it", () => {
		for (const { name, description } of GENUI_COMPONENTS) {
			expect(description.length, name).toBeGreaterThan(MIN_DESCRIPTION);
		}
	});
});
