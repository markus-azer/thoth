import type { ThunkAction, UnknownAction } from "@reduxjs/toolkit";

// Runtime settings the server hands to the browser. Thunks receive them as the extra argument.
export type AppConfig = { apiUrl: string; handle: string };

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

// Storage is read on demand, because the server render has no localStorage.
export type ThunkDeps = AppConfig & { getStorage: () => StorageLike };

export type Thunk<State, Result = void> = ThunkAction<
	Result,
	State,
	ThunkDeps,
	UnknownAction
>;
