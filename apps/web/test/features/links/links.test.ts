import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Links } from "~/features/links/index";

describe("Links", () => {
	it("RULE-LINKS-001: A visitor opens the home page → each link is shown as a button they can open.", () => {
		const html = renderToStaticMarkup(
			createElement(Links, {
				links: [
					{ label: "GitHub", href: "https://github.com/ada" },
					{ label: "Email", href: "mailto:ada@example.com" },
				],
			}),
		);

		expect(html).toContain('href="https://github.com/ada"');
		expect(html).toContain("GitHub");
		expect(html).toContain('href="mailto:ada@example.com"');
		expect(html).toContain("Email");
	});
});
