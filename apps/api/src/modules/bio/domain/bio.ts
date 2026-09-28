export class Bio {
	readonly id: string;
	readonly handle: string;
	readonly userId: string;
	readonly name: string;
	readonly headline: string;
	readonly about: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;

	constructor(props: {
		id: string;
		handle: string;
		userId: string;
		name: string;
		headline: string;
		about: string;
		createdAt: Date;
		updatedAt: Date;
	}) {
		Bio.requireNonBlank(props.handle, "handle");
		Bio.requireNonBlank(props.name, "name");
		Bio.requireNonBlank(props.headline, "headline");
		Bio.requireNonBlank(props.about, "about");

		this.id = props.id;
		this.handle = props.handle;
		this.userId = props.userId;
		this.name = props.name;
		this.headline = props.headline;
		this.about = props.about;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
	}

	private static requireNonBlank(value: string, field: string): void {
		if (!value.trim()) throw new Error(`Bio ${field} must not be blank`);
	}
}
