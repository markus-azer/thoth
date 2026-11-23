import type { AgentState } from "./state";

export const lastQuestion = (messages: AgentState["messages"]): string => {
	const asked = [...messages]
		.reverse()
		.find((message) => message.type === "human");

	return asked?.text ?? "";
};
