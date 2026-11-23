export const UiModel = Symbol("UiModel");

// An OpenUI Lang program. The web app renders it.
export type UiProgram = string;

export type WriteInput = { system: string; prompt: string };

export interface UiModel {
	write(input: WriteInput): Promise<string>;
}
