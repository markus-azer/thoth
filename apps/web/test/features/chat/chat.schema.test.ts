import { describe, expect, it } from "vitest";
import { toMessage } from "~/features/chat/chat.schema";

describe("toMessage", () => {
	it("RULE-CHAT-001: A visitor sends a long message → it is trimmed and cut to 500 characters.", () => {
		expect(toMessage("  hello  ")).toBe("hello");
		expect(toMessage("a".repeat(800))).toBe("a".repeat(500));
	});

	it("RULE-CHAT-002: A visitor sends a blank message → nothing is sent.", () => {
		expect(toMessage("   \n ")).toBeNull();
	});
});
