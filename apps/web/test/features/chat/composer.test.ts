import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CharacterCounter } from "~/features/chat/components/character-counter";
import { Composer } from "~/features/chat/components/composer";

const noop = () => undefined;

describe("chat composer", () => {
	it("labels the message box and caps its length", () => {
		const html = renderToStaticMarkup(
			createElement(Composer, {
				owner: "Ada Lovelace",
				draft: "",
				canSend: false,
				onChange: noop,
				onSubmit: noop,
			}),
		);

		expect(html).toContain('aria-label="Ask about Ada Lovelace"');
		expect(html).toContain('maxLength="500"');
	});

	it("shows the character count only near the limit", () => {
		const far = renderToStaticMarkup(
			createElement(CharacterCounter, { length: 100, max: 500 }),
		);
		const near = renderToStaticMarkup(
			createElement(CharacterCounter, { length: 450, max: 500 }),
		);

		expect(far).toBe("");
		expect(near).toContain("450/500");
	});
});
