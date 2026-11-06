import { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { Message } from "../domain/message";

export const buildMessages = (history: Message[]) =>
	history.map(({ role, content }) => {
		if (role === "user") return new HumanMessage(content);

		if (role === "assistant") return new AIMessage(content);

		throw new Error(`Unknown role: ${role}`);
	});
