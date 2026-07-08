import { Container } from "inversify";
import { MetricsServer } from "~/infrastructure/http/index";

export async function createContainer(): Promise<Container> {
	const container = new Container();

	// infrastructure
	container.bind(MetricsServer).toSelf().inSingletonScope();

	return container;
}
