import { Annotation } from "@langchain/langgraph";
import type { AgentContext } from "../agent.context";

export const AgentState = Annotation.Root({
	context: Annotation<AgentContext>(),
	reply: Annotation<string>(),
});

export type AgentState = typeof AgentState.State;
