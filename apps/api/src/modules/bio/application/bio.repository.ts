import type { Bio } from "../domain/bio";

export const BioRepository = Symbol("BioRepository");

export interface BioRepository {
	findByHandle(handle: string): Promise<Bio | null>;
}
