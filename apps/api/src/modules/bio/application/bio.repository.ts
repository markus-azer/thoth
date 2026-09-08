import type { Bio } from "../domain/bio";

export const BioRepository = Symbol("BioRepository");

export interface BioRepository {
	get(tenant: string): Promise<Bio | null>;
}
