import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
	type Conversation,
	findConversation,
	loadConversations,
	newConversationId,
	putFirst,
	sendMessage,
	ThreadNotFoundError,
	titleOf,
	toMessage,
} from "~/features/chat/index";
import type { Thunk } from "../helpers/index";

type Reply = { threadId: string; reply: string };

type Failure = "expired" | "failed";

// The question in flight. It is saved only once the reply lands.
type Asking = { conversationId: string; question: string };

export type ChatState = {
	loaded: boolean;
	conversations: Conversation[];
	activeId: string;
	draft: string;
	asking: Asking | null;
	notice: string | null;
};

const NOTICES: Record<Failure, string> = {
	expired:
		"This conversation expired. Send your message again to start a new one.",
	failed: "Something went wrong. Please try again.",
};

export const initialChatState = (activeId: string): ChatState => {
	return {
		loaded: false,
		conversations: [],
		activeId,
		draft: "",
		asking: null,
		notice: null,
	};
};

const openChat = (state: ChatState, id: string) => {
	state.activeId = id;
	state.draft = "";
	state.notice = null;
};

// Ids are made here so the reducers stay pure.
const prepareNewChatId = () => ({ payload: newConversationId() });

const slice = createSlice({
	name: "chat",
	// Lazy, so each store gets its own chat id.
	initialState: () => initialChatState(newConversationId()),
	reducers: {
		loaded: (state, action: PayloadAction<Conversation[]>) => {
			state.loaded = true;
			state.conversations = action.payload;
		},

		draftChanged: (state, action: PayloadAction<string>) => {
			state.draft = action.payload;
		},

		asked: (state, action: PayloadAction<string>) => {
			state.draft = "";
			state.notice = null;
			state.asking = {
				conversationId: state.activeId,
				question: action.payload,
			};
		},

		answered: (state, action: PayloadAction<Reply>) => {
			if (!state.asking) {
				return;
			}

			const { conversationId, question } = state.asking;
			const conversation = findConversation(
				state.conversations,
				conversationId,
			);

			if (!conversation.title) {
				conversation.title = titleOf(question);
			}

			conversation.threadId = action.payload.threadId;
			conversation.turns.push(
				{ role: "visitor", text: question },
				{ role: "agent", text: action.payload.reply },
			);

			state.conversations = putFirst(state.conversations, conversation);
			state.asking = null;
		},

		failed: (state, action: PayloadAction<Failure>) => {
			if (!state.asking) {
				return;
			}

			const { conversationId, question } = state.asking;

			state.asking = null;

			if (action.payload === "expired") {
				const conversation = findConversation(
					state.conversations,
					conversationId,
				);

				conversation.threadId = null;
				state.conversations = putFirst(state.conversations, conversation);
			}

			if (conversationId !== state.activeId) {
				return;
			}

			state.draft = question;
			state.notice = NOTICES[action.payload];
		},

		startedNewChat: {
			reducer: (state, action: PayloadAction<string>) => {
				openChat(state, action.payload);
			},
			prepare: prepareNewChatId,
		},
	},
});

export const chatReducer = slice.reducer;

const { loaded } = slice.actions;

export const { draftChanged, asked, answered, failed, startedNewChat } =
	slice.actions;

export const isPending = (chat: ChatState) => {
	return chat.asking?.conversationId === chat.activeId;
};

export const visibleTurns = (chat: ChatState) => {
	const { turns } = findConversation(chat.conversations, chat.activeId);

	if (!chat.asking || !isPending(chat)) {
		return turns;
	}

	return [...turns, { role: "visitor" as const, text: chat.asking.question }];
};

type ChatThunk<Result = void> = Thunk<{ chat: ChatState }, Result>;

export const loadHistory =
	(): ChatThunk =>
	(dispatch, _getState, { getStorage }) => {
		dispatch(loaded(loadConversations(getStorage())));
	};

export const sendQuestion =
	(text: string): ChatThunk<Promise<void>> =>
	async (dispatch, getState, config) => {
		const { activeId, asking, conversations } = getState().chat;
		const question = toMessage(text);

		if (!question || asking) {
			return;
		}

		const { threadId } = findConversation(conversations, activeId);

		dispatch(asked(question));

		try {
			const reply = await sendMessage(config, threadId, question);

			dispatch(answered(reply));
		} catch (error) {
			if (error instanceof ThreadNotFoundError) {
				dispatch(failed("expired"));
				return;
			}

			dispatch(failed("failed"));
		}
	};
