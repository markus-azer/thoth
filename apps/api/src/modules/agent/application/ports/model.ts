import type { AIMessage, BaseMessage } from "@langchain/core/messages";
import type { StructuredToolInterface } from "@langchain/core/tools";

export const AgentModel = Symbol("AgentModel");

export type ModelInput = {
	system: string;
	messages: BaseMessage[];
	tools: StructuredToolInterface[];
};

export interface AgentModel {
	answer(input: ModelInput): Promise<AIMessage>;
}
