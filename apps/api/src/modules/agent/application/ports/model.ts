import type { Message } from "~/modules/agent/domain/index";

export const AgentModel = Symbol("AgentModel");

export type ModelInput = {
	system: string;
	messages: Pick<Message, "role" | "content">[];
};

export interface AgentModel {
	answer(input: ModelInput): Promise<string>;
}
