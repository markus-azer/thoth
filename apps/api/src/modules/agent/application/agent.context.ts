import type { Message } from "../domain/message";
import type { Profile } from "./ports/index";

export type AgentContext = {
	profile: Profile;
	history: Message[];
};
