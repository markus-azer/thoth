import type { StructuredToolInterface } from "@langchain/core/tools";

export const AgentTools = Symbol("AgentTools");

export type Toolbox = {
	tools: StructuredToolInterface[];
	close(): Promise<void>;
};

export interface AgentTools {
	open(handle: string): Promise<Toolbox>;
}
