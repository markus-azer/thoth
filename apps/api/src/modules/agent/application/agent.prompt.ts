import type { AgentContext } from "./agent.context";
import { buildInstructions } from "./agent.instructions";
import type { ModelInput } from "./ports/index";

export const buildModelInput = ({
	profile,
	history,
}: AgentContext): ModelInput => {
	const messages = history.map(({ role, content }) => ({ role, content }));

	return { system: buildInstructions(profile), messages };
};
