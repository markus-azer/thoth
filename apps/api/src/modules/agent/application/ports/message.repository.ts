import type { Message } from "~/modules/agent/domain/index";

export const MessageRepository = Symbol("MessageRepository");

export interface MessageRepository {
	list(threadId: string): Promise<Message[]>;
	add(message: Message): Promise<void>;
}
