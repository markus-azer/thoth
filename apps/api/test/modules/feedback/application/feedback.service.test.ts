import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { FeedbackService } from "~/modules/feedback/application/feedback.service";

const setup = () => {
	const id = "id";
	const save = vi.fn().mockResolvedValue(undefined);
	const service = new FeedbackService({ save }, { next: () => id });

	return { id, service, save };
};

describe("FeedbackService", () => {
	it("RULE-FB-003: One call persists exactly one feedback entry", async () => {
		const { service, save } = setup();
		await service.submit({ message: "great talk" });

		expect(save).toHaveBeenCalledTimes(1);
	});

	it("RULE-FB-004: The app assigns `id` and `created_at` on persist", async () => {
		const { id, service, save } = setup();
		const result = await service.submit({ message: "great talk" });

		expect(result.id).toBe(id);
		expect(result.createdAt).toBeInstanceOf(Date);
		expect(save).toHaveBeenCalledWith(result);
	});

	it("leaves absent optional fields undefined", async () => {
		const { service } = setup();
		const feedback = await service.submit({ message: "great talk" });

		expect(feedback.name).toBeUndefined();
		expect(feedback.topic).toBeUndefined();
		expect(feedback.email).toBeUndefined();
	});
});
