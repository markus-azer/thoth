export const IdGenerator = Symbol("IdGenerator");

export interface IdGenerator {
	next(): string;
}
