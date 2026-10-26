import { describe, expect, it } from "vitest";
import { BlankMessage } from "~/modules/agent/domain/blank-message";
import { Message } from "~/modules/agent/domain/message";

const validProps = {
	id: "018e5e9a-79c1-7c3e-8b1a-000000000002",
	threadId: "018e5e9a-79c1-7c3e-8b1a-000000000001",
	role: "user",
	content: "hi",
	createdAt: new Date(2026, 0, 1),
} as const;

describe("Message", () => {
	it("rejects blank content", () => {
		const create = () => new Message({ ...validProps, content: "  " });

		expect(create).toThrow(BlankMessage);
	});
});
