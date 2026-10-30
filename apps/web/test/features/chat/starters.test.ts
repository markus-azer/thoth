import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Starters } from "~/features/chat/components/starters";
import { ThinkingBubble } from "~/features/chat/components/thinking-bubble";

describe("chat starters", () => {
	it("offers two topics and an invitation", () => {
		const html = renderToStaticMarkup(
			createElement(Starters, { disabled: false, onPick: () => undefined }),
		);

		expect(html).toContain("Quick intro");
		expect(html).toContain("Get in touch");
		expect(html).toContain("What can I ask?");
	});

	it("disables the starters while a reply is pending", () => {
		const html = renderToStaticMarkup(
			createElement(Starters, { disabled: true, onPick: () => undefined }),
		);

		expect(html.match(/disabled=""/g)).toHaveLength(3);
	});

	it("tells the visitor the agent is thinking", () => {
		const html = renderToStaticMarkup(createElement(ThinkingBubble));

		expect(html).toContain('aria-label="The agent is thinking"');
	});
});
