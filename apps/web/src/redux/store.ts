import { configureStore } from "@reduxjs/toolkit";
import type { AppConfig, ThunkDeps } from "./helpers/index";
import { rootReducer } from "./rootReducer";

const browserStorage = () => {
	return localStorage;
};

// A store per request. A shared one would mix visitors on the server.
export const makeStore = (
	config: AppConfig,
	getStorage: ThunkDeps["getStorage"] = browserStorage,
) => {
	const deps: ThunkDeps = { ...config, getStorage };

	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) => {
			return getDefaultMiddleware({ thunk: { extraArgument: deps } });
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
