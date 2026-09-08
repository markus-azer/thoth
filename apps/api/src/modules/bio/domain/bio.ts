export class Bio {
	readonly id: string;
	readonly tenant: string;
	readonly name: string;
	readonly headline: string;
	readonly about: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;

	constructor(props: {
		id: string;
		tenant: string;
		name: string;
		headline: string;
		about: string;
		createdAt: Date;
		updatedAt: Date;
	}) {
		this.id = props.id;
		this.tenant = props.tenant;
		this.name = props.name;
		this.headline = props.headline;
		this.about = props.about;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
	}
}
