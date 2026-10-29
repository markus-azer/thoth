import { describe, expect, it } from "vitest";
import {
	answered,
	asked,
	type ChatState,
	chatReducer,
	draftChanged,
	failed,
	initialChatState,
	isPending,
	startedNewChat,
	visibleTurns,
} from "~/redux/slices/chat";

const threadId = "3f2b8c1e-9a4d-4e6f-8b1a-2c3d4e5f6a7b";

type ChatAction = Parameters<typeof chatReducer>[1];

const apply = (state: ChatState, ...actions: ChatAction[]) => {
	return actions.reduce(chatReducer, state);
};

describe("chat slice", () => {
	it("RULE-CHAT-012: A visitor sends a message → it shows in the chat at once and the input clears.", () => {
		const typing = apply(initialChatState("a"), draftChanged("hi"));

		const sent = apply(typing, asked("hi"));

		expect(sent.draft).toBe("");
		expect(isPending(sent)).toBe(true);
		expect(visibleTurns(sent)).toEqual([{ role: "visitor", text: "hi" }]);
	});

	it("RULE-CHAT-013: The reply fails → the message returns to the input and the visitor is told.", () => {
		const afterFailure = apply(
			initialChatState("a"),
			asked("hi"),
			failed("failed"),
		);

		expect(afterFailure.draft).toBe("hi");
		expect(afterFailure.notice).toBe("Something went wrong. Please try again.");
		expect(isPending(afterFailure)).toBe(false);
		expect(visibleTurns(afterFailure)).toEqual([]);
	});

	it("a failed reply in another chat leaves the open chat alone", () => {
		const state = apply(
			initialChatState("a"),
			asked("hi"),
			startedNewChat(),
			draftChanged("typing"),
			failed("failed"),
		);

		expect(state.draft).toBe("typing");
		expect(state.notice).toBeNull();
		expect(isPending(state)).toBe(false);
	});

	it("RULE-CHAT-014: A visitor opens another chat while a reply is pending → the reply is saved in the chat it was asked in.", () => {
		const state = apply(
			initialChatState("a"),
			asked("hi"),
			startedNewChat(),
			answered({ threadId, reply: "Hello" }),
		);

		const [saved] = state.conversations;

		expect(state.activeId).not.toBe("a");
		expect(saved?.id).toBe("a");
		expect(saved?.threadId).toBe(threadId);
		expect(saved?.turns).toEqual([
			{ role: "visitor", text: "hi" },
			{ role: "agent", text: "Hello" },
		]);
	});
});
