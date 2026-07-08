import { Container } from "inversify";
import { Postgres } from "~/infrastructure/db/index";
import {
	AppRouter,
	HttpServer,
	MetricsServer,
	WelcomeRouter,
} from "~/infrastructure/http/index";

export async function createContainer(): Promise<Container> {
	const container = new Container();

	// infrastructure
	container.bind(Postgres).toSelf().inSingletonScope();
	container.bind(MetricsServer).toSelf().inSingletonScope();
	container.bind(HttpServer).toSelf().inSingletonScope();
	container.bind(AppRouter).toSelf().inSingletonScope();
	container.bind(WelcomeRouter).toSelf().inSingletonScope();

	return container;
}
