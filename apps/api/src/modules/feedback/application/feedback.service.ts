import { IdGenerator } from "@thoth/core";
import { ErrorCode } from "@thoth/utils/error-codes";
import { NotFound } from "@thoth/utils/errors";
import { inject, injectable } from "inversify";
import { Feedback } from "../domain/feedback";
import type { NewFeedbackDTO } from "./feedback.dto";
import { FeedbackRepository } from "./feedback.repository";
import { OwnerRepository } from "./owner.repository";

@injectable()
export class FeedbackService {
	constructor(
		@inject(FeedbackRepository) private readonly repo: FeedbackRepository,
		@inject(OwnerRepository) private readonly owners: OwnerRepository,
		@inject(IdGenerator) private readonly ids: IdGenerator,
	) {}

	async submit(
		handle: string | undefined,
		input: NewFeedbackDTO,
	): Promise<Feedback> {
		if (!handle) {
			throw new NotFound(ErrorCode.BIO_NOT_FOUND, "No handle given");
		}

		const userId = await this.owners.getUserIdByHandle(handle);

		const feedback = new Feedback({
			id: this.ids.next(),
			userId,
			message: input.message,
			name: input.name,
			topic: input.topic,
			email: input.email,
			createdAt: new Date(),
		});

		await this.repo.save(feedback);

		return feedback;
	}
}
