import { BlankMessage } from "./blank-message";

export type MessageRole = "user" | "assistant";

export class Message {
	readonly id: string;
	readonly threadId: string;
	readonly role: MessageRole;
	readonly content: string;
	readonly createdAt: Date;

	constructor(props: {
		id: string;
		threadId: string;
		role: MessageRole;
		content: string;
		createdAt: Date;
	}) {
		if (!props.content.trim()) throw new BlankMessage();

		this.id = props.id;
		this.threadId = props.threadId;
		this.role = props.role;
		this.content = props.content;
		this.createdAt = props.createdAt;
	}
}
