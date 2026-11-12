export class Feedback {
	readonly id: string;
	readonly userId: string;
	readonly message: string;
	readonly name: string | undefined;
	readonly topic: string | undefined;
	readonly email: string | undefined;
	readonly createdAt: Date;

	constructor(props: {
		id: string;
		userId: string;
		message: string;
		name?: string | undefined;
		topic?: string | undefined;
		email?: string | undefined;
		createdAt: Date;
	}) {
		this.id = props.id;
		this.userId = props.userId;
		this.message = props.message;
		this.name = props.name;
		this.topic = props.topic;
		this.email = props.email;
		this.createdAt = props.createdAt;
	}
}
