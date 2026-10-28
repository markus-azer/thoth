import { z } from "@thoth/utils/zod";
import { type Conversation, ConversationSchema } from "./chat.schema";

const STORAGE_NAME = "thoth.chat";
const MAX_CONVERSATIONS = 20;

type Store = Pick<Storage, "getItem" | "setItem">;

export const emptyConversation = (id: string): Conversation => {
	return { id, threadId: null, title: "", turns: [] };
};

export const newConversationId = () => {
	return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const putFirst = (list: Conversation[], conversation: Conversation) => {
	const others = list.filter((other) => other.id !== conversation.id);

	return [conversation, ...others].slice(0, MAX_CONVERSATIONS);
};

export const loadConversations = (store: Store): Conversation[] => {
	try {
		const raw = store.getItem(STORAGE_NAME);
		const stored = JSON.parse(raw ?? "[]");
		const parsed = z.array(ConversationSchema).safeParse(stored);

		return parsed.success ? parsed.data : [];
	} catch {
		return [];
	}
};

export const saveConversations = (store: Store, list: Conversation[]) => {
	try {
		store.setItem(STORAGE_NAME, JSON.stringify(list));
	} catch {
		// Full or blocked storage. The chat keeps working without saving.
	}
};
