import type { Bio } from "../domain/bio";

export const BioRepository = Symbol("BioRepository");

// Thrown when the handle already belongs to another user's bio.
export class HandleTaken extends Error {}

// What the owner supplies. id, userId, and the timestamps are assigned for them.
export interface BioFields {
	handle: string;
	name: string;
	headline: string;
	about: string;
}

// The service assigns the id up front, so an insert can be retried safely.
export interface NewBio extends BioFields {
	id: string;
}

export interface BioRepository {
	findByHandle(handle: string): Promise<Bio | null>;

	// null when the caller already has a bio.
	insert(userId: string, bio: NewBio): Promise<Bio | null>;

	// null when the caller has no bio yet.
	update(userId: string, fields: BioFields): Promise<Bio | null>;
}
