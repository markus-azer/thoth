import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadConversations } from "~/features/chat/chat.history";
import { loadHistory, sendQuestion } from "~/redux/slices/chat";
import { makeStore } from "~/redux/store";

const threadId = "3f2b8c1e-9a4d-4e6f-8b1a-2c3d4e5f6a7b";

const memoryStorage = () => {
	const values = new Map<string, string>();

	return {
		getItem: (name: string) => values.get(name) ?? null,
		setItem: (name: string, value: string) => {
			values.set(name, value);
		},
	};
};

const config = { apiUrl: "https://api.test", handle: "ada" };

const json = (body: unknown) => new Response(JSON.stringify(body));

describe("store", () => {
	beforeEach(() => {
		vi.stubGlobal("localStorage", memoryStorage());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("a blocked browser storage does not stop the chat", async () => {
		vi.unstubAllGlobals();
		Object.defineProperty(globalThis, "localStorage", {
			configurable: true,
			get: () => {
				throw new Error("blocked");
			},
		});
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(json({ id: threadId }))
			.mockResolvedValueOnce(json({ reply: "Hello" }));
		vi.stubGlobal("fetch", fetchMock);

		const store = makeStore(config);
		store.dispatch(loadHistory());
		await store.dispatch(sendQuestion("hi"));

		expect(store.getState().chat.notice).toBeNull();
		expect(store.getState().chat.conversations[0]?.turns).toHaveLength(2);
	});

	it("loading saved conversations does not write them back", () => {
		localStorage.setItem("thoth.chat", "not json");

		const store = makeStore(config);
		store.dispatch(loadHistory());

		expect(localStorage.getItem("thoth.chat")).toBe("not json");
	});

	it("RULE-CHAT-015: A visitor sends a message → it is saved in their browser once the reply arrives.", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(json({ id: threadId }))
			.mockResolvedValueOnce(json({ reply: "Hello" }));
		vi.stubGlobal("fetch", fetchMock);

		const store = makeStore(config);
		store.dispatch(loadHistory());
		await store.dispatch(sendQuestion("hi"));

		const saved = loadConversations(localStorage);

		expect(saved[0]?.turns).toEqual([
			{ role: "visitor", text: "hi" },
			{ role: "agent", text: "Hello" },
		]);
	});

	it("an expired thread is dropped so the next message starts a new one", async () => {
		const notFound = new Response(
			JSON.stringify({ code: "THREAD_NOT_FOUND" }),
			{
				status: 404,
			},
		);
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(json({ id: threadId }))
			.mockResolvedValueOnce(json({ reply: "Hello" }))
			.mockResolvedValueOnce(notFound);
		vi.stubGlobal("fetch", fetchMock);

		const store = makeStore(config);
		store.dispatch(loadHistory());
		await store.dispatch(sendQuestion("hi"));
		await store.dispatch(sendQuestion("still there?"));

		const { conversations, notice, draft } = store.getState().chat;

		expect(conversations[0]?.threadId).toBeNull();
		expect(notice).toBe(
			"This conversation expired. Send your message again to start a new one.",
		);
		expect(draft).toBe("still there?");
	});
});
