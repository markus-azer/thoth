import { afterEach, describe, expect, it, vi } from "vitest";
import { getBio } from "~/features/bio/bio.api";

vi.mock("~/env", () => ({
	env: { API_URL: "https://api.test", SITE_HANDLE: "ada" },
}));

function respond(status: number, body: unknown) {
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(JSON.stringify(body), { status })),
	);
}

const ada = {
	name: "Ada Lovelace",
	headline: "First programmer",
	about: "Wrote the first algorithm.",
};

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("getBio", () => {
	it("RULE-WEB-002: A visitor opens the home page → they see the bio for the configured site handle.", async () => {
		respond(200, ada);

		const bio = await getBio();

		expect(bio).toEqual(ada);
		expect(fetch).toHaveBeenCalledWith("https://api.test/bio/ada");
	});

	it("RULE-WEB-003: The bio can't be fetched → the build fails.", async () => {
		respond(404, { code: "BIO_NOT_FOUND" });

		await expect(getBio()).rejects.toThrow("404");
	});

	it("RULE-WEB-004: The bio is missing a field → the build fails.", async () => {
		respond(200, { ...ada, about: undefined });

		await expect(getBio()).rejects.toThrow();
	});

	it("RULE-WEB-005: The bio has a blank field → the build fails.", async () => {
		respond(200, { ...ada, name: "  " });

		await expect(getBio()).rejects.toThrow();
	});
});
