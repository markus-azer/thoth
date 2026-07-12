import { Container } from "inversify";
import { Postgres } from "~/infrastructure/db/index";
import {
	AppRouter,
	HealthRouter,
	HttpServer,
	McpRouter,
	MetricsServer,
	WelcomeRouter,
} from "~/infrastructure/http/index";
import { HealthController, HealthService } from "~/modules/health/index";

export async function createContainer(): Promise<Container> {
	const container = new Container();

	// infrastructure
	container.bind(Postgres).toSelf().inSingletonScope();
	container.bind(MetricsServer).toSelf().inSingletonScope();
	container.bind(HttpServer).toSelf().inSingletonScope();
	container.bind(AppRouter).toSelf().inSingletonScope();
	container.bind(WelcomeRouter).toSelf().inSingletonScope();
	container.bind(McpRouter).toSelf().inSingletonScope();

	// health module
	container.bind(HealthRouter).toSelf().inSingletonScope();
	container.bind(HealthController).toSelf().inSingletonScope();
	container.bind(HealthService).toSelf().inSingletonScope();

	return container;
}
