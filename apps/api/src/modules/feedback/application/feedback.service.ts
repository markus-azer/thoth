import { IdGenerator } from "@thoth/core";
import { inject, injectable } from "inversify";
import { Feedback } from "../domain/feedback";
import type { NewFeedbackDTO } from "./feedback.dto";
import { FeedbackRepository } from "./feedback.repository";

@injectable()
export class FeedbackService {
	constructor(
		@inject(FeedbackRepository) private readonly repo: FeedbackRepository,
		@inject(IdGenerator) private readonly ids: IdGenerator,
	) {}

	async submit(input: NewFeedbackDTO): Promise<Feedback> {
		const feedback = new Feedback({
			id: this.ids.next(),
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
