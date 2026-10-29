// @vitest-environment happy-dom
// @vitest-environment-options {"url": "https://api.test"}
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { loadConversations } from "~/features/chat/chat.history";
import { loadHistory, sendQuestion } from "~/redux/slices/chat";
import { makeStore } from "~/redux/store";

const threadId = "3f2b8c1e-9a4d-4e6f-8b1a-2c3d4e5f6a7b";
const newThreadId = "9c8b7a6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d";

const config = { apiUrl: "https://api.test", handle: "ada" };

const threadsUrl = `${config.apiUrl}/threads`;
const messagesUrl = (id: string) => `${threadsUrl}/${id}/messages`;

const server = setupServer();

beforeAll(() => {
	server.listen({ onUnhandledFrame: "error" });
});

afterEach(() => {
	vi.restoreAllMocks();
	server.resetHandlers();
	localStorage.clear();
});

afterAll(() => {
	server.close();
});

const threadCreated = (id: string) => {
	return http.post(threadsUrl, () => {
		return HttpResponse.json({ id }, { status: 201 });
	});
};

const replied = (id: string, reply: string) => {
	return http.post(messagesUrl(id), () => {
		return HttpResponse.json({ reply });
	});
};

const threadExpired = (id: string) => {
	return http.post(messagesUrl(id), () => {
		return HttpResponse.json({ code: "THREAD_NOT_FOUND" }, { status: 404 });
	});
};

describe("store", () => {
	it("RULE-CHAT-015: A visitor sends a message → it is saved in their browser once the reply arrives.", async () => {
		server.use(threadCreated(threadId), replied(threadId, "Hello"));

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
		server.use(threadCreated(threadId), replied(threadId, "Hello"));

		const store = makeStore(config);
		store.dispatch(loadHistory());
		await store.dispatch(sendQuestion("hi"));

		server.use(threadExpired(threadId));
		await store.dispatch(sendQuestion("still there?"));

		const afterExpiry = store.getState().chat;

		expect(afterExpiry.conversations[0]?.threadId).toBeNull();
		expect(afterExpiry.notice).toBe(
			"This conversation expired. Send your message again to start a new one.",
		);
		expect(afterExpiry.draft).toBe("still there?");

		server.use(threadCreated(newThreadId), replied(newThreadId, "Back"));
		await store.dispatch(sendQuestion("still there?"));

		expect(store.getState().chat.conversations[0]?.threadId).toBe(newThreadId);
	});

	it("a blocked browser storage does not stop the chat", async () => {
		vi.spyOn(globalThis, "localStorage", "get").mockImplementation(() => {
			throw new Error("blocked");
		});
		server.use(threadCreated(threadId), replied(threadId, "Hello"));

		const store = makeStore(config);
		store.dispatch(loadHistory());
		await store.dispatch(sendQuestion("hi"));

		const { notice, conversations } = store.getState().chat;

		expect(notice).toBeNull();
		expect(conversations[0]?.turns).toHaveLength(2);
	});
});
