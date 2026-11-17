import { genuiLibrary } from "./library";

export type PromptOptions = { preamble: string; examples: string[] };

export const genuiPrompt = (options: PromptOptions): string => {
	return genuiLibrary.prompt(options);
};
