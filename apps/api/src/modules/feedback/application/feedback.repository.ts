import type { Feedback } from "../domain/feedback";

export const FeedbackRepository = Symbol("FeedbackRepository");

export interface FeedbackRepository {
	save(feedback: Feedback): Promise<void>;
}
