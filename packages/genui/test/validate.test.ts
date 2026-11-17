import { createLibrary, defineComponent } from "@openuidev/lang-core";
import { z } from "@thoth/utils/zod";
import { describe, expect, it } from "vitest";
import { createValidator, isValidProgram, programProblems } from "../src/index";

describe("generated UI validation", () => {
	it("RULE-VALIDATE-001: A program that uses only library components is valid", () => {
		const program = [
			"root = Stack([next])",
			'next = Suggestions(["What is thoth?", "Who is the owner?"])',
		].join("\n");

		const valid = isValidProgram(program);

		expect(valid).toBe(true);
	});

	it("RULE-VALIDATE-002: A program that uses an unknown component is invalid", () => {
		const program = ["root = Stack([x])", 'x = Banner("hi")'].join("\n");

		const valid = isValidProgram(program);

		expect(valid).toBe(false);
	});

	it("RULE-VALIDATE-003: An empty program is invalid", () => {
		const valid = isValidProgram("");

		expect(valid).toBe(false);
	});

	it("RULE-VALIDATE-004: A program without a `root` is invalid", () => {
		const valid = isValidProgram('next = Suggestions(["Q?"])');

		expect(valid).toBe(false);
	});

	it("RULE-VALIDATE-005: A program whose `root` is not a `Stack` is invalid", () => {
		const valid = isValidProgram('root = Suggestions(["Q?"])');

		expect(valid).toBe(false);
	});

	it("RULE-VALIDATE-006: A prop of the wrong type is invalid", () => {
		const program = ["root = Stack([next])", 'next = Suggestions("Q?")'].join(
			"\n",
		);

		const valid = isValidProgram(program);

		expect(valid).toBe(false);
	});

	it("RULE-VALIDATE-007: A program that refers to a statement it never defines is invalid", () => {
		const program = ["root = Stack([a, b])", 'a = Suggestions(["Hi?"])'].join(
			"\n",
		);

		const valid = isValidProgram(program);

		expect(valid).toBe(false);
	});

	it("RULE-VALIDATE-008: A program with a statement that nothing uses is invalid", () => {
		const program = [
			"root = Stack([a])",
			'a = Suggestions(["Hi?"])',
			'unused = Suggestions(["Bye?"])',
		].join("\n");

		const valid = isValidProgram(program);

		expect(valid).toBe(false);
	});

	it("RULE-VALIDATE-009: A validator checks programs against the library it is given", () => {
		const Note = defineComponent({
			name: "Note",
			description: "A note.",
			props: z.object({ text: z.string() }),
			component: null,
		});
		const library = createLibrary({ root: "Note", components: [Note] });
		const validate = createValidator(library);
		const noteProgram = 'root = Note("hi")';
		const stackProgram = 'root = Stack([a])\na = Suggestions(["Hi?"])';

		const noteProblems = validate(noteProgram);
		const stackProblems = validate(stackProgram);

		expect(noteProblems).toEqual([]);
		expect(stackProblems).not.toEqual([]);
	});

	it("RULE-VALIDATE-010: A valid program has no problems", () => {
		const program = ["root = Stack([a])", 'a = Suggestions(["Hi?"])'].join(
			"\n",
		);

		const problems = programProblems(program);

		expect(problems).toEqual([]);
	});

	it("RULE-VALIDATE-011: Each problem names what is wrong", () => {
		const program = [
			"root = Stack([a, b])",
			'a = Suggestions(["1?", "2?", "3?", "4?", "5?"])',
		].join("\n");

		const problems = programProblems(program);

		expect(problems).toContain("b: is used but never defined");
		expect(problems).toContain(
			"Suggestions/questions: Give at most 4 questions",
		);
	});

	it("RULE-VALIDATE-012: A problem inside a child is reported once", () => {
		const program = [
			"root = Stack([site])",
			'site = Link("Site", "http://example.com")',
		].join("\n");

		const problems = programProblems(program);

		expect(problems).toEqual(["Link/url: A url must start with https"]);
	});
});
