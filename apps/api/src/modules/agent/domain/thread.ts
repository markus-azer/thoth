export class Thread {
	readonly id: string;
	readonly bioId: string;
	readonly createdAt: Date;

	constructor(props: { id: string; bioId: string; createdAt: Date }) {
		this.id = props.id;
		this.bioId = props.bioId;
		this.createdAt = props.createdAt;
	}
}
