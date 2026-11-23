import type { UiProgram } from "~/modules/agent/application/ports/index";

// The program is set only once it passes the checks.
export type UiDraft = {
	program?: UiProgram | undefined;
	rejected?: UiProgram | undefined;
	problems: string[];
	attempts: number;
};
