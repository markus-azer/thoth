import { injectable } from "inversify";
import { v7 as uuidv7 } from "uuid";
import type { IdGenerator } from "./id-generator";

@injectable()
export class UuidGenerator implements IdGenerator {
	next(): string {
		return uuidv7();
	}
}
