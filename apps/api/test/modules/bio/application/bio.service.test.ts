import "reflect-metadata";
import { ErrorCode, NotFound } from "@thoth/utils";
import { describe, expect, it, vi } from "vitest";
import { BioService } from "~/modules/bio/application/bio.service";
import { Bio } from "~/modules/bio/domain/bio";

const setup = () => {
	const get = vi.fn();
	const service = new BioService({ get });
	return { service, get };
};

const sampleBio = new Bio({
	id: "018e5e9a-79c1-7c3e-8b1a-000000000001",
	tenant: "markus",
	name: "Markus Azer",
	headline: "Software Engineer",
	about: "Builds things.",
	createdAt: new Date(2026, 0, 1),
	updatedAt: new Date(2026, 0, 1),
});

describe("BioService", () => {
	it("RULE-BIO-002: The tenant is fixed. No selection input exists yet.", async () => {
		const { service, get } = setup();
		get.mockResolvedValue(sampleBio);

		await expect(service.get()).resolves.toBe(sampleBio);
		expect(get).toHaveBeenCalledWith("markus");
	});

	it("RULE-BIO-003: NOT_FOUND throws a `NotFound` domain error (`ErrorCode.BIO_NOT_FOUND`).", async () => {
		const { service, get } = setup();
		get.mockResolvedValue(null);

		await expect(service.get()).rejects.toSatisfy((err: NotFound) => {
			expect(err).toBeInstanceOf(NotFound);
			expect(err.code).toBe(ErrorCode.BIO_NOT_FOUND);
			expect(err.message).toMatch(/markus/);
			return true;
		});
	});
});
