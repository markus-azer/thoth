import "reflect-metadata";
import { ErrorCode } from "@thoth/utils";
import { describe, expect, it, vi } from "vitest";
import { HandleTaken } from "~/modules/bio/application/bio.repository";
import { BioService } from "~/modules/bio/application/bio.service";
import { Bio } from "~/modules/bio/domain/bio";

const setup = () => {
	const findByHandle = vi.fn();
	const insert = vi.fn();
	const update = vi.fn();
	const ids = { next: vi.fn().mockReturnValue("new-id") };
	const service = new BioService({ findByHandle, insert, update }, ids);
	return { service, findByHandle, insert, update, ids };
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

const input = {
	handle: "markus-azer",
	name: "Markus Azer",
	headline: "Software Engineer",
	about: "Builds things.",
};

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
			message: expect.stringContaining("ghost"),
		});
		expect(findByHandle).toHaveBeenCalledWith("ghost");
	});

	it("create() inserts under the caller's userId with a freshly generated id", async () => {
		const { service, insert, ids } = setup();
		insert.mockResolvedValue(sampleBio);

		await expect(service.create("u1", input)).resolves.toBe(sampleBio);
		expect(insert).toHaveBeenCalledWith("u1", { id: "new-id", ...input });
		expect(ids.next).toHaveBeenCalled();
	});

	it("RULE-BIO-007: `create_bio`, an existing bio for the caller → ALREADY_EXISTS.", async () => {
		const { service, insert } = setup();
		insert.mockResolvedValue(null);

		await expect(service.create("u1", input)).rejects.toMatchObject({
			code: ErrorCode.BIO_ALREADY_EXISTS,
		});
	});

	it("update() writes the caller's own bio", async () => {
		const { service, update } = setup();
		update.mockResolvedValue(sampleBio);

		await expect(service.update("u1", input)).resolves.toBe(sampleBio);
		expect(update).toHaveBeenCalledWith("u1", input);
	});

	it("RULE-BIO-009: `update_bio`, no existing bio for the caller → NOT_FOUND.", async () => {
		const { service, update } = setup();
		update.mockResolvedValue(null);

		await expect(service.update("u1", input)).rejects.toMatchObject({
			code: ErrorCode.BIO_NOT_FOUND,
		});
	});

	it("RULE-BIO-010: A `handle` already owned by a different user → HANDLE_TAKEN.", async () => {
		const { service, insert } = setup();
		insert.mockRejectedValue(new HandleTaken());

		await expect(service.create("u2", input)).rejects.toMatchObject({
			code: ErrorCode.BIO_HANDLE_TAKEN,
			message: expect.stringContaining("markus-azer"),
		});
	});

	it("update() surfaces a handle collision as HANDLE_TAKEN too", async () => {
		const { service, update } = setup();
		update.mockRejectedValue(new HandleTaken());

		await expect(service.update("u2", input)).rejects.toMatchObject({
			code: ErrorCode.BIO_HANDLE_TAKEN,
		});
	});

	it("lets repository errors other than HandleTaken propagate", async () => {
		const { service, insert } = setup();
		const boom = new Error("connection lost");
		insert.mockRejectedValue(boom);

		await expect(service.create("u1", input)).rejects.toBe(boom);
	});
});
