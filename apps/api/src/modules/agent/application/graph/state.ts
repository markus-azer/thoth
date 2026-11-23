import type { AIMessage, BaseMessage } from "@langchain/core/messages";
import { Annotation, messagesStateReducer } from "@langchain/langgraph";
import type { UiDraft } from "./ui-draft";

export const AgentState = Annotation.Root({
	messages: Annotation<BaseMessage[]>({
		reducer: messagesStateReducer,
		default: () => [],
	}),
	reply: Annotation<AIMessage>(),
	uiDraft: Annotation<UiDraft>({
		reducer: (_current, next) => next,
		default: () => ({ problems: [], attempts: 0 }),
	}),
	toolRounds: Annotation<number>({
		reducer: (_current, next) => next,
		default: () => 0,
	}),
});

export type AgentState = typeof AgentState.State;
