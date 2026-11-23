import { GENUI_EXAMPLE } from "@thoth/genui";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GenuiView } from "~/features/chat/genui/genui-view";

const render = (program: string) => {
	return renderToStaticMarkup(
		createElement(GenuiView, {
			program,
			interactive: true,
			onContinue: () => undefined,
		}),
	);
};

describe("generated UI", () => {
	it("shows suggestions as buttons", () => {
		const html = render(
			'root = Stack([next])\nnext = Suggestions(["What is thoth?", "Who is the owner?"])',
		);

		expect(html).toContain("What is thoth?");
		expect(html).toContain("Who is the owner?");
		expect(html).toContain("<button");
	});

	it("shows an https link", () => {
		const html = render(
			'root = Stack([site])\nsite = Link("GitHub", "https://github.com/markus")',
		);

		expect(html).toContain('href="https://github.com/markus"');
	});

	it("does not link a non-https url", () => {
		const html = render(
			'root = Stack([site])\nsite = Link("Bad", "javascript:alert(1)")',
		);

		expect(html).not.toContain("href=");
	});

	it("drops a component it does not know", () => {
		const html = render('root = Stack([x])\nx = Banner("hi")');

		expect(html).not.toContain("hi");
	});

	it("renders every component in the prompt example", () => {
		const html = render(GENUI_EXAMPLE);

		expect(html).toContain("<button");
		expect(html).toContain('href="https://github.com/example"');
	});
});
