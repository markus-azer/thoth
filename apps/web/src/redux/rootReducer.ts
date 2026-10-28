import { combineReducers } from "@reduxjs/toolkit";
import { chatReducer } from "./slices/chat";

export const rootReducer = combineReducers({
	chat: chatReducer,
});
