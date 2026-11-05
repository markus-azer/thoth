import "reflect-metadata";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ErrorCode } from "@thoth/utils/error-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ModelInput } from "~/modules/agent/application/ports/index";
import { OpenRouterAgentModel } from "~/modules/agent/infrastructure/agent.openrouter-model";

const invoke = vi.hoisted(() => vi.fn());
const bindTools = vi.hoisted(() => vi.fn());

vi.mock("@langchain/openrouter", () => ({
	ChatOpenRouter: class {
		invoke = invoke;
		bindTools = bindTools;
	},
}));

const input: ModelInput = {
	system: "You are Markus.",
	messages: [new HumanMessage("hi")],
	tools: [],
};

describe("OpenRouterAgentModel", () => {
	beforeEach(() => {
		invoke.mockReset();
		bindTools.mockReset();
	});

	it("sends the system prompt first, then the conversation, and returns the reply", async () => {
		const reply = new AIMessage("hello");
		invoke.mockResolvedValue(reply);

		const result = await new OpenRouterAgentModel().answer(input);

		const [conversation] = invoke.mock.calls[0] ?? [];
		expect(
			conversation.map((message: { text: string }) => message.text),
		).toEqual(["You are Markus.", "hi"]);
		expect(conversation[0].getType()).toBe("system");
		expect(result).toBe(reply);
	});

	it("binds the tools when there are any", async () => {
		const tools = [{ name: "get_bio" }] as ModelInput["tools"];
		const bound = { invoke: vi.fn().mockResolvedValue(new AIMessage("ok")) };
		bindTools.mockReturnValue(bound);

		await new OpenRouterAgentModel().answer({ ...input, tools });

		expect(bindTools).toHaveBeenCalledWith(tools);
		expect(bound.invoke).toHaveBeenCalled();
		expect(invoke).not.toHaveBeenCalled();
	});

	it("fails with a 502 when the model call fails", async () => {
		invoke.mockRejectedValue(new Error("429 rate limited"));

		const result = new OpenRouterAgentModel().answer(input);

		await expect(result).rejects.toMatchObject({
			code: ErrorCode.AGENT_MODEL_UNAVAILABLE,
			status: 502,
		});
	});

	it("fails with a 502 when the model does not answer in time", async () => {
		const timeout = new AbortController();
		const timeoutSpy = vi
			.spyOn(AbortSignal, "timeout")
			.mockReturnValue(timeout.signal);
		invoke.mockImplementation(
			(_conversation, { signal }: { signal: AbortSignal }) =>
				new Promise((_resolve, reject) => {
					signal.addEventListener("abort", () => reject(signal.reason));
				}),
		);

		const result = new OpenRouterAgentModel().answer(input);
		const assertion = expect(result).rejects.toMatchObject({
			code: ErrorCode.AGENT_MODEL_UNAVAILABLE,
			status: 502,
		});
		timeout.abort();

		await assertion;
		expect(timeoutSpy).toHaveBeenCalledWith(30_000);
		timeoutSpy.mockRestore();
	});
});
