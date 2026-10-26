import "reflect-metadata";
import { ErrorCode } from "@thoth/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ModelInput } from "~/modules/agent/application/ports/index";
import { OpenRouterAgentModel } from "~/modules/agent/infrastructure/agent.openrouter-model";

const invoke = vi.hoisted(() => vi.fn());

vi.mock("@langchain/openrouter", () => ({
	ChatOpenRouter: class {
		invoke = invoke;
	},
}));

const input: ModelInput = {
	system: "You are Markus.",
	messages: [{ role: "user", content: "hi" }],
};

describe("OpenRouterAgentModel", () => {
	beforeEach(() => {
		invoke.mockReset();
	});

	it("returns the text of the model reply", async () => {
		invoke.mockResolvedValue({ text: "hello" });

		const reply = await new OpenRouterAgentModel().answer(input);

		expect(reply).toBe("hello");
	});

	it("sends the system prompt first, then the conversation", async () => {
		invoke.mockResolvedValue({ text: "hello" });

		await new OpenRouterAgentModel().answer(input);

		expect(invoke).toHaveBeenCalledWith(
			[
				{ role: "system", content: "You are Markus." },
				{ role: "user", content: "hi" },
			],
			expect.anything(),
		);
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
