export const ProfileRepository = Symbol("ProfileRepository");

export type Profile = {
	id: string;
	handle: string;
	name: string;
	headline: string;
	about: string;
};

export interface ProfileRepository {
	getByHandle(handle: string): Promise<Profile>;

	getById(id: string): Promise<Profile>;
}
