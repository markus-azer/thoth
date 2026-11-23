import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { describe, expect, it, vi } from "vitest";
import { buildGraph } from "~/modules/agent/application/graph/graph";
import { TOOLS_EXHAUSTED_NOTICE } from "~/modules/agent/application/graph/nodes/model";
import type {
	ModelInput,
	UiModel,
} from "~/modules/agent/application/ports/index";

const makeTool = (func: () => Promise<string>) =>
	new DynamicStructuredTool({
		name: "get_bio",
		description: "Reads the bio.",
		schema: { type: "object" as const, properties: {} },
		func,
	});

const callsTool = (id: number) =>
	new AIMessage({
		content: "",
		tool_calls: [{ id: `call-${id}`, name: "get_bio", args: {} }],
	});

const makeUi = (write = vi.fn().mockResolvedValue("")) => ({ write });

const run = (
	answer: (input: ModelInput) => Promise<AIMessage>,
	tool = makeTool(async () => "bio"),
	ui: UiModel = makeUi(),
	question = "who?",
) =>
	buildGraph({ answer }, [tool], ui).invoke({
		messages: [new HumanMessage(question)],
	});

describe("agent graph", () => {
	it("runs a requested tool and lets the model answer from its result", async () => {
		const answer = vi
			.fn()
			.mockResolvedValueOnce(callsTool(1))
			.mockResolvedValueOnce(new AIMessage("Markus is an engineer."));

		const { reply } = await run(answer);

		const toolResult = answer.mock.calls[1]?.[0].messages.at(-1);
		expect(toolResult.text).toBe("bio");
		expect(reply.text).toBe("Markus is an engineer.");
	});

	it("RULE-AGENT-004: A tool failure still ends in REPLIED.", async () => {
		const failing = makeTool(async () => {
			throw new Error("db down");
		});
		const failAnswer = vi
			.fn()
			.mockResolvedValueOnce(callsTool(1))
			.mockResolvedValueOnce(new AIMessage("Sorry, that failed."));

		const afterFailure = await run(failAnswer, failing);

		const toolError = failAnswer.mock.calls[1]?.[0].messages.at(-1);
		expect(toolError.text).toContain("db down");
		expect(afterFailure.reply.text).toBe("Sorry, that failed.");

		let id = 0;
		const loopAnswer = vi.fn(async ({ allowTools }: ModelInput) =>
			allowTools ? callsTool(++id) : new AIMessage("Enough tools."),
		);

		const afterLoop = await run(loopAnswer);

		expect(afterLoop.reply.text).toBe("Enough tools.");
		expect(loopAnswer).toHaveBeenCalledTimes(6);

		const systems = loopAnswer.mock.calls.map(([input]) => input.system);
		expect(systems.at(-1)).toContain(TOOLS_EXHAUSTED_NOTICE);
		expect(systems.slice(0, -1)).not.toContainEqual(
			expect.stringContaining(TOOLS_EXHAUSTED_NOTICE),
		);
	});

	it("RULE-AGENT-005: A model that ignores the five-round tool cap is stopped.", async () => {
		let id = 0;
		const stubborn = vi.fn(async () => callsTool(++id));

		const { reply } = await run(stubborn);

		expect(stubborn).toHaveBeenCalledTimes(6);
		expect(reply.tool_calls).toHaveLength(0);
		expect(reply.text).toBe("");
	});

	describe("ui", () => {
		const URL = "https://example.com/a";
		const answers = () =>
			vi.fn().mockResolvedValue(new AIMessage(`See ${URL}.`));
		const SUGGESTIONS = 'root = Stack([a])\na = Suggestions(["One?", "Two?"])';
		const MIXED = `root = Stack([a, b])\na = Suggestions(["One?"])\nb = Link("example.com", "${URL}")`;

		it("adds no ui when the model writes nothing", async () => {
			const { uiDraft } = await run(answers(), undefined, makeUi());

			expect(uiDraft.program).toBeUndefined();
		});

		it("adds no ui and does not retry when the model says NONE", async () => {
			const write = vi.fn().mockResolvedValue("NONE");

			const { uiDraft } = await run(answers(), undefined, makeUi(write));

			expect(uiDraft.program).toBeUndefined();
			expect(write).toHaveBeenCalledTimes(1);
		});

		it("uses a valid program that mixes components", async () => {
			const write = vi.fn().mockResolvedValue(`\`\`\`\n${MIXED}\n\`\`\``);

			const { uiDraft } = await run(answers(), undefined, makeUi(write));

			expect(uiDraft.program).toBe(MIXED);
			expect(write).toHaveBeenCalledTimes(1);
		});

		it("RULE-AGENT-006: The model writes the UI as one program, or none when no UI helps.", async () => {
			const write = vi.fn().mockResolvedValue(SUGGESTIONS);

			const { uiDraft } = await run(answers(), undefined, makeUi(write));

			const input = write.mock.calls[0]?.[0];
			expect(input.system).toContain("Suggestions");
			expect(input.prompt).toContain("only if it clearly helps");
			expect(uiDraft.program).toBe(SUGGESTIONS);
		});

		it("RULE-AGENT-007: Written UI is checked and retried once with the problems.", async () => {
			const write = vi
				.fn()
				.mockResolvedValueOnce("not a program")
				.mockResolvedValueOnce(SUGGESTIONS);

			const { uiDraft } = await run(answers(), undefined, makeUi(write));

			expect(write.mock.calls[1]?.[0].prompt).toContain("Fix these problems");
			expect(uiDraft.program).toBe(SUGGESTIONS);
		});

		it("RULE-AGENT-008: A UI that stays invalid is dropped and the reply is text only.", async () => {
			const write = vi.fn().mockResolvedValue("not a program");

			const { reply, uiDraft } = await run(answers(), undefined, makeUi(write));

			expect(write).toHaveBeenCalledTimes(2);
			expect(uiDraft.program).toBeUndefined();
			expect(reply.text).toBe(`See ${URL}.`);
		});

		it("RULE-AGENT-009: A link must point to a URL in the answer.", async () => {
			const invented = MIXED.replace(URL, "https://evil.example/x");
			const write = vi
				.fn()
				.mockResolvedValueOnce(invented)
				.mockResolvedValueOnce(MIXED);

			const { uiDraft } = await run(answers(), undefined, makeUi(write));

			expect(write.mock.calls[1]?.[0].prompt).toContain(
				"https://evil.example/x is not in the answer",
			);
			expect(uiDraft.program).toBe(MIXED);
		});
	});
});
