import type { Thread } from "~/modules/agent/domain/index";

export const ThreadRepository = Symbol("ThreadRepository");

export interface ThreadRepository {
	find(id: string): Promise<Thread | null>;
	add(thread: Thread): Promise<void>;
}
