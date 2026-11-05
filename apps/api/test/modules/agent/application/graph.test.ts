import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { describe, expect, it, vi } from "vitest";
import { buildGraph } from "~/modules/agent/application/graph/graph";
import { TOOLS_EXHAUSTED_NOTICE } from "~/modules/agent/application/graph/nodes/model";
import type { ModelInput } from "~/modules/agent/application/ports/index";

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

const run = (
	answer: (input: ModelInput) => Promise<AIMessage>,
	tool = makeTool(async () => "bio"),
) =>
	buildGraph({ answer }, [tool]).invoke({
		messages: [new HumanMessage("who?")],
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

	it("RULE-AGENT-004: A tool failure or a runaway tool loop still ends in REPLIED.", async () => {
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

	it("RULE-AGENT-005: A model that ignores the tool cap is stopped.", async () => {
		let id = 0;
		const stubborn = vi.fn(async () => callsTool(++id));

		const { reply } = await run(stubborn);

		expect(stubborn).toHaveBeenCalledTimes(6);
		expect(reply.tool_calls).toHaveLength(0);
		expect(reply.text).toBe("");
	});
});
