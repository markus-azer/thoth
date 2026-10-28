import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import {
	ChatFailedError,
	sendMessage,
	ThreadNotFoundError,
} from "~/features/chat/chat.api";

const threadId = "3f2b8c1e-9a4d-4e6f-8b1a-2c3d4e5f6a7b";

const config = { apiUrl: "https://api.test", handle: "ada" };

const threadsUrl = `${config.apiUrl}/threads`;
const messagesUrl = `${threadsUrl}/${threadId}/messages`;

const server = setupServer();
const requestedUrls: string[] = [];

server.events.on("request:start", ({ request }) => {
	requestedUrls.push(request.url);
});

beforeAll(() => {
	server.listen({ onUnhandledFrame: "error" });
});

afterEach(() => {
	server.resetHandlers();
	requestedUrls.length = 0;
});

afterAll(() => {
	server.close();
});

const threadCreated = () => {
	return http.post(threadsUrl, () => {
		return HttpResponse.json({ id: threadId }, { status: 201 });
	});
};

const replied = (reply: string) => {
	return http.post(messagesUrl, () => {
		return HttpResponse.json({ reply });
	});
};

const failedWith = (status: number, code: string) => {
	return http.post(messagesUrl, () => {
		return HttpResponse.json({ code }, { status });
	});
};

describe("sendMessage", () => {
	it("RULE-CHAT-007: A visitor sends their first message → a thread is started and they get the reply.", async () => {
		server.use(threadCreated(), replied("Hi"));

		const result = await sendMessage(config, null, "Who is Ada?");

		expect(result).toEqual({ threadId, reply: "Hi" });
		expect(requestedUrls).toEqual([threadsUrl, messagesUrl]);
	});

	it("RULE-CHAT-008: A visitor sends a follow-up → it goes to the same thread.", async () => {
		server.use(replied("Again"));

		const result = await sendMessage(config, threadId, "More?");

		expect(result.threadId).toBe(threadId);
		expect(requestedUrls).toEqual([messagesUrl]);
	});

	it("RULE-CHAT-009: The thread is not found → the visitor is told and the next message starts a new thread.", async () => {
		server.use(failedWith(404, "THREAD_NOT_FOUND"));

		const attempt = sendMessage(config, threadId, "Hi");

		await expect(attempt).rejects.toBeInstanceOf(ThreadNotFoundError);

		const newThreadId = "9c8b7a6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d";
		const newMessagesUrl = `${threadsUrl}/${newThreadId}/messages`;

		server.use(
			http.post(threadsUrl, () => {
				return HttpResponse.json({ id: newThreadId }, { status: 201 });
			}),
			http.post(newMessagesUrl, () => {
				return HttpResponse.json({ reply: "Hello again" });
			}),
		);
		requestedUrls.length = 0;

		const next = await sendMessage(config, null, "Hi again");

		expect(next.threadId).toBe(newThreadId);
		expect(next.reply).toBe("Hello again");
		expect(requestedUrls).toEqual([threadsUrl, newMessagesUrl]);
	});

	it("RULE-CHAT-010: The agent fails or the network drops → the visitor is asked to try again.", async () => {
		server.use(failedWith(500, "INTERNAL_ERROR"));
		const afterServerError = sendMessage(config, threadId, "Hi");

		await expect(afterServerError).rejects.toBeInstanceOf(ChatFailedError);

		server.use(http.post(messagesUrl, () => HttpResponse.error()));
		const afterNetworkError = sendMessage(config, threadId, "Hi");

		await expect(afterNetworkError).rejects.toBeInstanceOf(ChatFailedError);
	});

	it("RULE-CHAT-011: A thread is started → it is always for the configured site handle.", async () => {
		const bodies: unknown[] = [];

		server.use(
			http.post(threadsUrl, async ({ request }) => {
				const body = await request.json();

				bodies.push(body);

				return HttpResponse.json({ id: threadId }, { status: 201 });
			}),
			replied("Hi"),
		);

		await sendMessage(config, null, "Who is Ada?");

		expect(bodies).toEqual([{ handle: "ada" }]);
	});
});
