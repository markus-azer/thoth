import { configureStore } from "@reduxjs/toolkit";
import { type Conversation, saveConversations } from "~/features/chat/index";
import { type AppConfig, saveOnChange, type ThunkDeps } from "./helpers/index";
import { rootReducer } from "./rootReducer";

export type RootState = ReturnType<typeof rootReducer>;

const browserStorage = () => {
	return localStorage;
};

// A store per request. A shared one would mix visitors on the server.
export const makeStore = (
	config: AppConfig,
	getStorage: ThunkDeps["getStorage"] = browserStorage,
) => {
	const deps: ThunkDeps = { ...config, getStorage };
	const store = configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) => {
			return getDefaultMiddleware({ thunk: { extraArgument: deps } });
		},
	});

	// Waits for the load, so a fresh page never overwrites saved history.
	const selectLoadedConversations = ({ chat }: RootState) => {
		if (!chat.loaded) {
			return undefined;
		}

		return chat.conversations;
	};

	const save = (conversations: Conversation[]) => {
		saveConversations(getStorage(), conversations);
	};

	saveOnChange(store, selectLoadedConversations, save);

	return store;
};
