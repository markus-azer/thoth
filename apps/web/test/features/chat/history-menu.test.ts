import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HistoryMenu } from "~/features/chat/components/history-menu";

const noop = () => undefined;

const render = (conversations: { id: string; title: string }[]) => {
	return renderToStaticMarkup(
		createElement(HistoryMenu, {
			conversations: conversations.map((conversation) => ({
				...conversation,
				threadId: null,
				turns: [],
			})),
			activeId: "a",
			onSelect: noop,
			onClear: noop,
		}),
	);
};

describe("chat history menu", () => {
	it("is disabled while there is no history", () => {
		expect(render([])).toContain('disabled=""');
	});

	it("is enabled and closed once there is history", () => {
		const html = render([{ id: "a", title: "Hello" }]);

		expect(html).not.toContain('disabled=""');
		expect(html).toContain('aria-expanded="false"');
	});
});
