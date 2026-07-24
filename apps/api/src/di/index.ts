import { IdGenerator, UuidGenerator } from "@thoth/core";
import { Container } from "inversify";
import { Postgres } from "~/infrastructure/db/index";
import {
	AppRouter,
	HealthRouter,
	HttpServer,
	McpRouter,
	McpTool,
	MetricsServer,
	WelcomeRouter,
} from "~/infrastructure/http/index";
import {
	FeedbackRepository,
	FeedbackService,
	FeedbackTool,
} from "~/modules/feedback/index";
import { PostgresFeedbackRepository } from "~/modules/feedback/infrastructure/feedback.pg-repository";
import {
	DbProbe,
	HealthController,
	HealthService,
} from "~/modules/health/index";
import { PostgresDbProbe } from "~/modules/health/infrastructure/health.pg-probe";

export async function createContainer(): Promise<Container> {
	const container = new Container();

	// infrastructure
	container.bind(Postgres).toSelf().inSingletonScope();
	container.bind(IdGenerator).to(UuidGenerator).inSingletonScope();
	container.bind(MetricsServer).toSelf().inSingletonScope();
	container.bind(HttpServer).toSelf().inSingletonScope();
	container.bind(AppRouter).toSelf().inSingletonScope();
	container.bind(WelcomeRouter).toSelf().inSingletonScope();
	container.bind(McpRouter).toSelf().inSingletonScope();

	// health module
	container.bind(HealthRouter).toSelf().inSingletonScope();
	container.bind(HealthController).toSelf().inSingletonScope();
	container.bind(DbProbe).to(PostgresDbProbe).inSingletonScope();
	container.bind(HealthService).toSelf().inSingletonScope();

	// feedback module
	container.bind(McpTool).to(FeedbackTool).inSingletonScope();
	container
		.bind(FeedbackRepository)
		.to(PostgresFeedbackRepository)
		.inSingletonScope();
	container.bind(FeedbackService).toSelf().inSingletonScope();

	return container;
}
