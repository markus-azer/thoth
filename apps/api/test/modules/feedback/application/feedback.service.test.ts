import "reflect-metadata";
import { ErrorCode } from "@thoth/utils/error-codes";
import { NotFound } from "@thoth/utils/errors";
import { describe, expect, it, vi } from "vitest";
import { FeedbackService } from "~/modules/feedback/application/feedback.service";

const handle = "markus-azer";
const input = { message: "great talk" };
const noBio = new NotFound(ErrorCode.BIO_NOT_FOUND, "No bio");

const setup = () => {
	const id = "id";
	const save = vi.fn().mockResolvedValue(undefined);
	const getUserIdByHandle = vi.fn().mockResolvedValue("u1");
	const service = new FeedbackService(
		{ save },
		{ getUserIdByHandle },
		{ next: () => id },
	);

	return { id, service, save, getUserIdByHandle };
};

describe("FeedbackService", () => {
	it("RULE-FB-003: One call persists one entry.", async () => {
		const { service, save } = setup();
		await service.submit(handle, input);

		expect(save).toHaveBeenCalledTimes(1);
	});

	it("RULE-FB-004: The app assigns `id` and `created_at`.", async () => {
		const { id, service, save } = setup();
		const result = await service.submit(handle, input);

		expect(result.id).toBe(id);
		expect(result.createdAt).toBeInstanceOf(Date);
		expect(save).toHaveBeenCalledWith(result);
	});

	it("RULE-FB-005: The entry stores the `user_id` of the bio that owns `:handle`.", async () => {
		const { service, getUserIdByHandle } = setup();
		const result = await service.submit(handle, input);

		expect(getUserIdByHandle).toHaveBeenCalledWith(handle);
		expect(result.userId).toBe("u1");
	});

	it("RULE-FB-006: Bare `/mcp` → NOT_FOUND, nothing persisted.", async () => {
		const { service, save, getUserIdByHandle } = setup();
		const submitting = service.submit(undefined, input);

		await expect(submitting).rejects.toBeInstanceOf(NotFound);
		expect(getUserIdByHandle).not.toHaveBeenCalled();
		expect(save).not.toHaveBeenCalled();
	});

	it("RULE-FB-007: An unknown `:handle` → NOT_FOUND, nothing persisted.", async () => {
		const { service, save, getUserIdByHandle } = setup();
		getUserIdByHandle.mockRejectedValue(noBio);
		const submitting = service.submit("nobody", input);

		await expect(submitting).rejects.toBe(noBio);
		expect(save).not.toHaveBeenCalled();
	});

	it("leaves absent optional fields undefined", async () => {
		const { service } = setup();
		const feedback = await service.submit(handle, input);

		expect(feedback.name).toBeUndefined();
		expect(feedback.topic).toBeUndefined();
		expect(feedback.email).toBeUndefined();
	});
});
