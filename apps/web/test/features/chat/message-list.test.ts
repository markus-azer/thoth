import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MessageList } from "~/features/chat/components/message-list";

const render = (props: {
	turns?: { role: "visitor" | "agent"; text: string }[];
	pending?: boolean;
	notice?: string | null;
}) => {
	return renderToStaticMarkup(
		createElement(MessageList, {
			turns: [],
			pending: false,
			notice: null,
			onPickStarter: () => undefined,
			...props,
		}),
	);
};

describe("chat message list", () => {
	it("shows starters while the chat is empty", () => {
		expect(render({})).toContain("Not sure where to start?");
	});

	it("shows the turns in place of the starters", () => {
		const html = render({
			turns: [
				{ role: "visitor", text: "hi" },
				{ role: "agent", text: "Hello" },
			],
		});

		expect(html).toContain(">hi</p>");
		expect(html).toContain(">Hello</p>");
		expect(html).not.toContain("Not sure where to start?");
	});

	it("shows the thinking bubble while a reply is pending", () => {
		const html = render({ pending: true });

		expect(html).toContain("The agent is thinking");
		expect(html).not.toContain("Not sure where to start?");
	});

	it("tells the visitor when something went wrong", () => {
		const html = render({ notice: "Something went wrong." });

		expect(html).toContain('role="alert"');
		expect(html).toContain("Something went wrong.");
	});
});
