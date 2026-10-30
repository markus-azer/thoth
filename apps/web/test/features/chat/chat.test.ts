import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { Chat } from "~/features/chat/components/index";
import { renderWithStore } from "../../render-with-store";

describe("chat", () => {
	it("shows starters and an empty reply area before the first message", () => {
		const html = renderWithStore(
			createElement(Chat, { owner: "Ada Lovelace" }),
		);

		expect(html).toContain("Not sure where to start?");
		expect(html).toContain('aria-label="Ask about Ada Lovelace"');
		expect(html).toContain('aria-live="polite"');
	});
});
