// @vitest-environment happy-dom
import { GENUI_EXAMPLE } from "@thoth/genui";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GenuiView } from "~/features/chat/genui/genui-view";

Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);

const FIRST_QUESTION = "What is thoth?";

const SUGGESTIONS_PROGRAM = `root = Stack([next])\nnext = Suggestions(["${FIRST_QUESTION}", "Who is the owner?"])`;

const renderHtml = (program: string) => {
	return renderToStaticMarkup(
		createElement(GenuiView, {
			program,
			interactive: true,
			onContinue: () => undefined,
		}),
	);
};

let mountedRoot: Root | undefined;

const mountSuggestions = (
	interactive: boolean,
	onContinue: (message: string) => void,
) => {
	const container = document.createElement("div");
	const root = createRoot(container);
	mountedRoot = root;

	act(() => {
		root.render(
			createElement(GenuiView, {
				program: SUGGESTIONS_PROGRAM,
				interactive,
				onContinue,
			}),
		);
	});

	return [...container.querySelectorAll("button")];
};

describe("generated UI", () => {
	afterEach(() => {
		act(() => mountedRoot?.unmount());
		mountedRoot = undefined;
	});

	it("shows an https link", () => {
		const html = renderHtml(
			'root = Stack([site])\nsite = Link("GitHub", "https://github.com/markus")',
		);

		expect(html).toContain('href="https://github.com/markus"');
	});

	it("shows an uppercase HTTPS link", () => {
		const html = renderHtml(
			'root = Stack([site])\nsite = Link("GitHub", "HTTPS://github.com/markus")',
		);

		expect(html).toContain('href="HTTPS://github.com/markus"');
	});

	it("does not link a non-https url", () => {
		const html = renderHtml(
			'root = Stack([site])\nsite = Link("Bad", "javascript:alert(1)")',
		);

		expect(html).not.toContain("href=");
	});

	it("drops a component it does not know", () => {
		const html = renderHtml('root = Stack([x])\nx = Banner("hi")');

		expect(html).not.toContain("hi");
	});

	it("renders every component in the prompt example", () => {
		const html = renderHtml(GENUI_EXAMPLE);

		expect(html).toContain("<button");
		expect(html).toContain('href="https://github.com/example"');
	});

	it("sends the question of a clicked suggestion", () => {
		const onContinue = vi.fn();
		const [first] = mountSuggestions(true, onContinue);

		act(() => first?.click());

		expect(onContinue).toHaveBeenCalledExactlyOnceWith(FIRST_QUESTION);
	});

	it("disables the suggestions while the chat is busy", () => {
		const onContinue = vi.fn();
		const buttons = mountSuggestions(false, onContinue);

		act(() => buttons[0]?.click());

		expect(buttons.every((button) => button.disabled)).toBe(true);
		expect(onContinue).not.toHaveBeenCalled();
	});
});
