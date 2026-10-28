import type { ThunkAction, UnknownAction } from "@reduxjs/toolkit";

// Runtime settings the server hands to the browser. Thunks receive them as the extra argument.
export type AppConfig = { apiUrl: string; handle: string };

// Storage is read on demand, because the server render has no localStorage.
export type ThunkDeps = AppConfig & { getStorage: () => Storage };

export type Thunk<State, Result = void> = ThunkAction<
	Result,
	State,
	ThunkDeps,
	UnknownAction
>;
