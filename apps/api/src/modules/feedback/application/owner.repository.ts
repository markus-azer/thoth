export const OwnerRepository = Symbol("OwnerRepository");

export interface OwnerRepository {
	// Throws NotFound when no bio owns the handle.
	getUserIdByHandle(handle: string): Promise<string>;
}
