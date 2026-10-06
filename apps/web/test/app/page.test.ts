import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import Page, { revalidate } from "~/app/page";

vi.mock("~/features/bio/bio.api", () => ({
	getBio: async () => ({
		name: "Ada Lovelace",
		headline: "First programmer",
		about: "Wrote the first algorithm.",
	}),
}));

describe("home page", () => {
	it("RULE-WEB-006: A visitor opens the home page → they see the owner's name, headline, and about.", async () => {
		const page = await Page();
		const html = renderToStaticMarkup(page);

		expect(html).toContain("Ada Lovelace");
		expect(html).toContain("First programmer");
		expect(html).toContain("Wrote the first algorithm.");
	});

	it("RULE-WEB-007: The owner changes the bio → the home page updates within 5 minutes.", () => {
		expect(revalidate).toBe(300);
	});
});
