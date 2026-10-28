import { describe, expect, it } from "vitest";
import {
	emptyConversation,
	loadConversations,
	newConversationId,
	putFirst,
	saveConversations,
} from "~/features/chat/chat.history";

function memoryStore(initial?: string) {
	let value = initial ?? null;

	return {
		getItem: () => value,
		setItem: (_name: string, next: string) => {
			value = next;
		},
	};
}

describe("chat history", () => {
	it("RULE-CHAT-003: A visitor gets a reply → the conversation is saved in their browser, newest first.", () => {
		const store = memoryStore();
		const first = { ...emptyConversation("a"), title: "First" };
		const second = { ...emptyConversation("b"), title: "Second" };

		const afterFirst = putFirst([], first);
		const list = putFirst(afterFirst, second);
		saveConversations(store, list);

		const saved = loadConversations(store);
		const savedIds = saved.map((conversation) => conversation.id);
		const reopened = putFirst(list, first);
		const reopenedIds = reopened.map((conversation) => conversation.id);

		expect(savedIds).toEqual(["b", "a"]);
		expect(reopenedIds).toEqual(["a", "b"]);
	});

	it("RULE-CHAT-004: A visitor saved over 20 conversations → only the 20 newest are kept.", () => {
		let list = [emptyConversation("0")];
		for (let i = 1; i <= 25; i++) {
			list = putFirst(list, emptyConversation(String(i)));
		}

		expect(list).toHaveLength(20);
		expect(list[0]?.id).toBe("25");
	});

	it("RULE-CHAT-005: The saved conversations can't be read → the visitor starts with none.", () => {
		const notJson = memoryStore("not json");
		const wrongShape = memoryStore('[{"id":1}]');
		const empty = memoryStore();

		expect(loadConversations(notJson)).toEqual([]);
		expect(loadConversations(wrongShape)).toEqual([]);
		expect(loadConversations(empty)).toEqual([]);
	});

	it("RULE-CHAT-006: A visitor starts a new chat → it gets an id of its own, in any browser.", () => {
		const first = newConversationId();
		const second = newConversationId();

		expect(first).not.toBe(second);
	});
});
