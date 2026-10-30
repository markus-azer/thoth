import { configureStore } from "@reduxjs/toolkit";
import type { AppConfig, StorageLike, ThunkDeps } from "./helpers/index";
import { rootReducer } from "./rootReducer";

const noStorage: StorageLike = {
	getItem: () => null,
	setItem: () => undefined,
};

// Reading localStorage throws when the browser blocks storage.
const browserStorage = () => {
	try {
		return localStorage;
	} catch {
		return noStorage;
	}
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
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
