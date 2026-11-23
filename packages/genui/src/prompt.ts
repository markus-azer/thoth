import { genuiLibrary } from "./library";

export const GENUI_EXAMPLE = [
	"root = Stack([next, more])",
	'next = Suggestions(["What is thoth?", "Who is the owner?"])',
	'more = Link("github.com", "https://github.com/example")',
].join("\n");

export const genuiPrompt = (preamble: string): string => {
	return genuiLibrary.prompt({ preamble, examples: [GENUI_EXAMPLE] });
};
