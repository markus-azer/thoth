import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
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
		const client = await connectMcp(tool);

		const { tools } = await client.listTools();
		expect(tools.map((t) => t.name)).toContain("submit_feedback");
	});

	it("ACKNOWLEDGED: a valid call persists via the service", async () => {
		const { tool, submit } = setup();
		const client = await connectMcp(tool);

		const result = await client.callTool({
			name: "submit_feedback",
			arguments: { message: "great talk", email: "sam@example.com" },
		});

		expect(submit).toHaveBeenCalledWith({
			message: "great talk",
			email: "sam@example.com",
		});
		expect(result.isError).toBeFalsy();
	});

	it("RULE-FB-001: Empty `message` → INVALID_INPUT", async () => {
		const { tool, submit } = setup();
		const client = await connectMcp(tool);

		const result = await client.callTool({
			name: "submit_feedback",
			arguments: { message: "" },
		});

		expect(result.isError).toBe(true);
		expect(submit).not.toHaveBeenCalled();
	});

	it("RULE-FB-002: When present, an invalid `email` → INVALID_INPUT", async () => {
		const { tool, submit } = setup();
		const client = await connectMcp(tool);

		const result = await client.callTool({
			name: "submit_feedback",
			arguments: { message: "hi", email: "nope" },
		});

		expect(result.isError).toBe(true);
		expect(submit).not.toHaveBeenCalled();
	});
});
