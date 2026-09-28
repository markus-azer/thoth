import { describe, expect, it } from "vitest";
import { Bio } from "~/modules/bio/domain/bio";

const validProps = {
	id: "018e5e9a-79c1-7c3e-8b1a-000000000001",
	handle: "markus-azer",
	name: "Markus Azer",
	headline: "Software Engineer",
	about: "Builds things.",
	createdAt: new Date(2026, 0, 1),
	updatedAt: new Date(2026, 0, 1),
};

describe("Bio", () => {
	it("constructs with valid fields", () => {
		expect(() => new Bio(validProps)).not.toThrow();
	});

	it.each([
		"handle",
		"name",
		"headline",
		"about",
	] as const)("rejects a blank %s", (field) => {
		expect(() => new Bio({ ...validProps, [field]: "  " })).toThrow();
	});
});
