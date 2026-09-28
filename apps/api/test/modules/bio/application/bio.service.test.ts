import "reflect-metadata";
import { ErrorCode } from "@thoth/utils";
import { describe, expect, it, vi } from "vitest";
import { BioService } from "~/modules/bio/application/bio.service";
import { Bio } from "~/modules/bio/domain/bio";

const setup = () => {
	const findByHandle = vi.fn();
	const service = new BioService({ findByHandle });
	return { service, findByHandle };
};

const sampleBio = new Bio({
	id: "018e5e9a-79c1-7c3e-8b1a-000000000001",
	userId: "u1",
	handle: "markus-azer",
	name: "Markus Azer",
	headline: "Software Engineer",
	about: "Builds things.",
	createdAt: new Date(2026, 0, 1),
	updatedAt: new Date(2026, 0, 1),
});

describe("BioService", () => {
	it("RULE-BIO-002: `:identifier` matches a handle → FOUND for that bio.", async () => {
		const { service, findByHandle } = setup();
		findByHandle.mockResolvedValue(sampleBio);

		await expect(service.get("markus-azer")).resolves.toBe(sampleBio);
		expect(findByHandle).toHaveBeenCalledWith("markus-azer");
	});

	it("RULE-BIO-003: `:identifier` absent → NOT_FOUND.", async () => {
		const { service, findByHandle } = setup();

		await expect(service.get(undefined)).rejects.toMatchObject({
			code: ErrorCode.BIO_NOT_FOUND,
		});
		expect(findByHandle).not.toHaveBeenCalled();
	});

	it("RULE-BIO-004: `:identifier` matches no handle → NOT_FOUND.", async () => {
		const { service, findByHandle } = setup();
		findByHandle.mockResolvedValue(null);

		await expect(service.get("ghost")).rejects.toMatchObject({
			code: ErrorCode.BIO_NOT_FOUND,
		});
	});
});
