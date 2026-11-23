import { END } from "@langchain/langgraph";
import { genuiPrompt } from "@thoth/genui";
import type {
	UiModel,
	UiProgram,
} from "~/modules/agent/application/ports/index";
import { uiProblems } from "../check-ui";
import { lastQuestion } from "../last-question";
import type { AgentState } from "../state";

const MAX_UI_ATTEMPTS = 2;
const CODE_FENCE = /```[a-z]*\n?/g;

const NO_UI = "NONE";
const NO_UI_PATTERN = new RegExp(`^${NO_UI}\\.?$`, "i");

const UI_TASK = `Write small UI to show under the answer, only if it clearly helps. If no UI helps, output exactly the single word ${NO_UI}.`;

const LAST_PROGRAM = "Your last program:";
const FIX_REQUEST = "Fix these problems in it:";

const WRITE_SYSTEM = genuiPrompt(
	"You write small UI for a chat. Output only OpenUI Lang.",
);

const writeUi = async (
	ui: UiModel,
	{ messages, reply, uiDraft }: AgentState,
): Promise<UiProgram> => {
	const prompt = [
		`Question: ${lastQuestion(messages)}`,
		`Answer: ${reply.text}`,
		UI_TASK,
	];

	if (uiDraft.rejected) {
		prompt.push(
			LAST_PROGRAM,
			uiDraft.rejected,
			FIX_REQUEST,
			...uiDraft.problems,
		);
	}

	const text = await ui.write({
		system: WRITE_SYSTEM,
		prompt: prompt.join("\n"),
	});

	return text.replace(CODE_FENCE, "").trim();
};

export const makeComposeNode = (ui: UiModel) => async (state: AgentState) => {
	const program = await writeUi(ui, state);
	const attempts = state.uiDraft.attempts + 1;

	const wantsNoUi = program === "" || NO_UI_PATTERN.test(program);

	if (wantsNoUi) return { uiDraft: { problems: [], attempts } };

	const problems = uiProblems(program, state.reply.text);
	const valid = problems.length === 0;

	return {
		uiDraft: {
			program: valid ? program : undefined,
			rejected: valid ? undefined : program,
			problems,
			attempts,
		},
	};
};

export const afterCompose = ({ uiDraft }: AgentState) => {
	if (uiDraft.problems.length === 0) return END;

	return uiDraft.attempts < MAX_UI_ATTEMPTS ? "compose" : END;
};
