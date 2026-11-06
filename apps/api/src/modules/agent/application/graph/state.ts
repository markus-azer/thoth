import type { AIMessage, BaseMessage } from "@langchain/core/messages";
import { Annotation, messagesStateReducer } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
	messages: Annotation<BaseMessage[]>({
		reducer: messagesStateReducer,
		default: () => [],
	}),
	reply: Annotation<AIMessage>(),
	toolRounds: Annotation<number>({
		reducer: (_current, next) => next,
		default: () => 0,
	}),
});

export type AgentState = typeof AgentState.State;
