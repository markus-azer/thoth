export class BlankMessage extends Error {
	constructor() {
		super("Message content must not be blank");
		this.name = "BlankMessage";
	}
}
