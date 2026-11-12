import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { createContainer } from "~/di/index";
import { PrivateToolNames } from "~/infrastructure/mcp/index";
import type { FeedbackService } from "~/modules/feedback/application/feedback.service";
import { FeedbackTool } from "~/modules/feedback/interface/feedback.tool";
import { connectMcp } from "../../../support/mcp";

// A FeedbackTool backed by a stubbed service, so we test the tool, not the service.
const setup = () => {
	const submit = vi.fn().mockResolvedValue(undefined);
	const tool = new FeedbackTool({ submit } as unknown as FeedbackService);
	return { tool, submit };
};

describe("FeedbackTool", () => {
	it("registers submit_feedback", async () => {
		const { tool } = setup();
		const client = await connectMcp({}, tool);

		const { tools } = await client.listTools();
		expect(tools.map((t) => t.name)).toContain("submit_feedback");
	});

	it("ACKNOWLEDGED: a valid call persists via the service", async () => {
		const { tool, submit } = setup();
		const client = await connectMcp({ handle: "markus-azer" }, tool);

		const result = await client.callTool({
			name: "submit_feedback",
			arguments: { message: "great talk", email: "sam@example.com" },
		});

		expect(submit).toHaveBeenCalledWith("markus-azer", {
			message: "great talk",
			email: "sam@example.com",
		});
		expect(result.isError).toBeFalsy();
	});

	it("RULE-FB-001: Empty `message` → INVALID_INPUT.", async () => {
		const { tool, submit } = setup();
		const client = await connectMcp({}, tool);

		const result = await client.callTool({
			name: "submit_feedback",
			arguments: { message: "" },
		});

		expect(result.isError).toBe(true);
		expect(JSON.stringify(result.content)).toMatch(/message/i);
		expect(submit).not.toHaveBeenCalled();
	});

	it("RULE-FB-002: An invalid `email` → INVALID_INPUT.", async () => {
		const { tool, submit } = setup();
		const client = await connectMcp({}, tool);

		const result = await client.callTool({
			name: "submit_feedback",
			arguments: { message: "hi", email: "nope" },
		});

		expect(result.isError).toBe(true);
		expect(JSON.stringify(result.content)).toMatch(/email/i);
		expect(submit).not.toHaveBeenCalled();
	});

	it("RULE-FB-008: No sign-in needed.", async () => {
		const container = await createContainer();
		const privateTools = container.get(PrivateToolNames);

		expect(privateTools).not.toContain("submit_feedback");
	});
});
