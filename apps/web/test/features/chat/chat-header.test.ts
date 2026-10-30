import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChatHeader } from "~/features/chat/components/chat-header";

const render = (hasMessages: boolean) => {
	return renderToStaticMarkup(
		createElement(ChatHeader, {
			owner: "Ada Lovelace",
			conversations: [],
			activeId: "a",
			hasMessages,
			onSelect: () => undefined,
			onClear: () => undefined,
			onNewChat: () => undefined,
		}),
	);
};

describe("chat header", () => {
	it("titles the chat with the owner's first name", () => {
		expect(render(false)).toContain("Ada&#x27;s assistant");
	});

	it("offers a new chat only once there are messages", () => {
		const newChat = 'aria-label="New chat"';

		expect(render(false)).toMatch(new RegExp(`${newChat}[^>]*disabled=""`));
		expect(render(true)).not.toMatch(new RegExp(`${newChat}[^>]*disabled=""`));
	});
});
