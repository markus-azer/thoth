import { describe, expect, it, vi } from "vitest";
import Page, { revalidate } from "~/app/page";
import { renderWithStore } from "../render-with-store";

const render = async () => {
	const page = await Page();

	return renderWithStore(page);
};

vi.mock("~/features/bio/bio.api", () => ({
	getBio: async () => ({
		name: "Ada Lovelace",
		headline: "First programmer",
		about: "Wrote the first algorithm.",
	}),
}));

describe("home page", () => {
	it("RULE-WEB-006: A visitor opens the home page → they see the owner's name and headline.", async () => {
		const html = await render();

		expect(html).toContain("Ada Lovelace");
		expect(html).toContain("First programmer");
		expect(html).not.toContain("Wrote the first algorithm.");
	});

	it("RULE-CHAT-015: A visitor opens the home page → they see a labelled message box and a live reply area.", async () => {
		const html = await render();

		expect(html).toContain('aria-label="Ask about Ada Lovelace"');
		expect(html).toContain('aria-live="polite"');
	});

	it("RULE-WEB-007: The bio changed over 5 minutes ago → the next visit rebuilds the home page.", () => {
		expect(revalidate).toBe(300);
	});
});
