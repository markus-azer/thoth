import type { z } from "@thoth/utils/zod";
import { ReplySchema, ThreadSchema } from "./chat.schema";

export class ThreadNotFoundError extends Error {}
export class ChatFailedError extends Error {}

type ChatConfig = { apiUrl: string; handle: string };

const NOT_FOUND = 404;

const post = async <T>(
	url: string,
	body: unknown,
	schema: z.ZodType<T>,
): Promise<T> => {
	let res: Response;

	try {
		res = await fetch(url, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body),
		});
	} catch {
		throw new ChatFailedError("Chat request failed: no response");
	}

	// Only a message post can mean the thread is gone.
	if (res.status === NOT_FOUND && url.endsWith("/messages")) {
		throw new ThreadNotFoundError();
	}

	if (!res.ok) {
		throw new ChatFailedError(`Chat request failed with status ${res.status}`);
	}

	const data = await res.json();

	return schema.parse(data);
};

const createThread = (config: ChatConfig) => {
	return post(
		`${config.apiUrl}/threads`,
		{ handle: config.handle },
		ThreadSchema,
	);
};

export const sendMessage = async (
	config: ChatConfig,
	threadId: string | null,
	message: string,
) => {
	const thread = threadId ? { id: threadId } : await createThread(config);

	const { reply } = await post(
		`${config.apiUrl}/threads/${thread.id}/messages`,
		{ message },
		ReplySchema,
	);

	return { threadId: thread.id, reply };
};
