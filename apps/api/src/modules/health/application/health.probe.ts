export const DbProbe = Symbol("DbProbe");

export interface DbProbe {
	ping(): Promise<boolean>;
}
