import { Container } from "inversify";

export async function createContainer(): Promise<Container> {
	const container = new Container();

	return container;
}
