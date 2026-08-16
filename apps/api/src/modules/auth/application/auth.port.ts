import type { Principal } from "../domain/principal";

export const AuthPort = Symbol("AuthPort");

export interface AuthPort {
	// Returns undefined when the token is missing, invalid, expired, or revoked.
	verifyBearer(token: string): Promise<Principal | undefined>;
}
