// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import {
	emptyConversation,
	loadConversations,
	newConversationId,
	putFirst,
	saveConversations,
} from "~/features/chat/chat.history";
import type { Conversation } from "~/features/chat/chat.schema";

const STORAGE_KEY = "thoth.chat";

const idsOf = (list: Conversation[]) => {
	return list.map((conversation) => conversation.id);
};

beforeEach(() => {
	localStorage.clear();
});

describe("chat history", () => {
	it("RULE-CHAT-003: A visitor gets a reply → the conversation is saved in their browser, newest first.", () => {
		const first = { ...emptyConversation("a"), title: "First" };
		const second = { ...emptyConversation("b"), title: "Second" };

		const afterFirst = putFirst([], first);
		const list = putFirst(afterFirst, second);

		saveConversations(localStorage, list);

		const reopened = putFirst(list, first);

		expect(idsOf(loadConversations(localStorage))).toEqual(["b", "a"]);
		expect(idsOf(reopened)).toEqual(["a", "b"]);
	});

	it("RULE-CHAT-004: A visitor saved over 20 conversations → only the 20 newest are kept.", () => {
		const conversations = Array.from({ length: 25 }, (_, index) => {
			return emptyConversation(String(index + 1));
		});

		const list = conversations.reduce<Conversation[]>((saved, conversation) => {
			return putFirst(saved, conversation);
		}, []);

		expect(list).toHaveLength(20);
		expect(list[0]?.id).toBe("25");
	});

	it("RULE-CHAT-005: The saved conversations can't be read → the visitor starts with none.", () => {
		expect(loadConversations(localStorage)).toEqual([]);

		localStorage.setItem(STORAGE_KEY, "not json");
		expect(loadConversations(localStorage)).toEqual([]);

		localStorage.setItem(STORAGE_KEY, '[{"id":1}]');
		expect(loadConversations(localStorage)).toEqual([]);
	});

	it("RULE-CHAT-006: A visitor starts a new chat → it gets an id of its own, in any browser.", () => {
		const first = newConversationId();
		const second = newConversationId();

		expect(first).not.toBe(second);
	});
});
