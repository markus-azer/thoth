import { programProblems } from "@thoth/genui";
import type { UiProgram } from "~/modules/agent/application/ports/index";

const URL_PATTERN = /https:\/\/[^\s)\]>"']+/g;
const TRAILING_PUNCTUATION = /[.,;:!?]+$/;

const urlsIn = (text: string): string[] => {
	const found = text.match(URL_PATTERN) ?? [];

	return found.map((url) => url.replace(TRAILING_PUNCTUATION, ""));
};

const unknownLinks = (program: UiProgram, answer: string): string[] => {
	const allowed = new Set(urlsIn(answer));

	return urlsIn(program)
		.filter((url) => !allowed.has(url))
		.map((url) => `The link ${url} is not in the answer.`);
};

export const uiProblems = (program: UiProgram, answer: string): string[] => {
	return [...programProblems(program), ...unknownLinks(program, answer)];
};
