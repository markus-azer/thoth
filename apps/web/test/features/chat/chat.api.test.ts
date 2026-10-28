import { afterEach, describe, expect, it, vi } from "vitest";
import {
	ChatFailedError,
	sendMessage,
	ThreadNotFoundError,
} from "~/features/chat/chat.api";

const threadId = "3f2b8c1e-9a4d-4e6f-8b1a-2c3d4e5f6a7b";

const config = { apiUrl: "https://api.test", handle: "ada" };

function stub(...responses: Array<Response | Error>) {
	const fetchMock = vi.fn();

	for (const response of responses) {
		if (response instanceof Error) {
			fetchMock.mockRejectedValueOnce(response);
		} else {
			fetchMock.mockResolvedValueOnce(response);
		}
	}

	vi.stubGlobal("fetch", fetchMock);

	return fetchMock;
}

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), { status });

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("sendMessage", () => {
	it("RULE-CHAT-007: A visitor sends their first message → a thread is started and they get the reply.", async () => {
		const fetchMock = stub(json({ id: threadId }, 201), json({ reply: "Hi" }));

		const result = await sendMessage(config, null, "Who is Ada?");
		const urls = fetchMock.mock.calls.map(([url]) => url);

		expect(result).toEqual({ threadId, reply: "Hi" });
		expect(urls).toEqual([
			"https://api.test/threads",
			`https://api.test/threads/${threadId}/messages`,
		]);
	});

	it("RULE-CHAT-008: A visitor sends a follow-up → it goes to the same thread.", async () => {
		const fetchMock = stub(json({ reply: "Again" }));

		const result = await sendMessage(config, threadId, "More?");
		const [firstCall] = fetchMock.mock.calls;
		const url = firstCall?.[0];

		expect(result.threadId).toBe(threadId);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(url).toBe(`https://api.test/threads/${threadId}/messages`);
	});

	it("RULE-CHAT-009: The thread is not found → the visitor is told and the next message starts a new thread.", async () => {
		stub(json({ code: "THREAD_NOT_FOUND" }, 404));

		const attempt = sendMessage(config, threadId, "Hi");

		await expect(attempt).rejects.toBeInstanceOf(ThreadNotFoundError);
	});

	it("RULE-CHAT-010: The agent fails or the network drops → the visitor is asked to try again.", async () => {
		stub(json({ code: "INTERNAL_ERROR" }, 500));
		const afterServerError = sendMessage(config, threadId, "Hi");

		await expect(afterServerError).rejects.toBeInstanceOf(ChatFailedError);

		stub(new Error("offline"));
		const afterNetworkError = sendMessage(config, threadId, "Hi");

		await expect(afterNetworkError).rejects.toBeInstanceOf(ChatFailedError);
	});

	it("RULE-CHAT-011: A thread is started → it is always for the configured site handle.", async () => {
		const fetchMock = stub(json({ id: threadId }, 201), json({ reply: "Hi" }));

		await sendMessage(config, null, "Who is Ada?");

		const [, init] = fetchMock.mock.calls[0] ?? [];

		expect(JSON.parse(init.body)).toEqual({ handle: "ada" });
	});
});
