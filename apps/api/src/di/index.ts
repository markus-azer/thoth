import { IdGenerator, UuidGenerator } from "@thoth/core";
import { Container } from "inversify";
import { Postgres } from "~/infrastructure/db/index";
import {
	AgentRouter,
	AppRouter,
	AuthRouter,
	BioRouter,
	HealthRouter,
	HttpServer,
	McpRouter,
	MetricsServer,
	WelcomeRouter,
} from "~/infrastructure/http/index";
import { McpTool, PrivateToolNames } from "~/infrastructure/mcp/index";
import {
	AgentController,
	AgentModel,
	AgentService,
	MessageRepository,
	ProfileRepository,
	ThreadRepository,
} from "~/modules/agent/index";
import { BioProfileRepository } from "~/modules/agent/infrastructure/agent.bio-profile-repository";
import { OpenRouterAgentModel } from "~/modules/agent/infrastructure/agent.openrouter-model";
import { PostgresMessageRepository } from "~/modules/agent/infrastructure/agent.pg-message-repository";
import { PostgresThreadRepository } from "~/modules/agent/infrastructure/agent.pg-thread-repository";
import {
	Auth,
	AuthController,
	AuthPort,
	BetterAuthVerifier,
	createAuth,
} from "~/modules/auth/index";
import {
	BioController,
	BioRepository,
	BioService,
	BioTool,
} from "~/modules/bio/index";
import { PostgresBioRepository } from "~/modules/bio/infrastructure/bio.pg-repository";
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

	// bio module
	container.bind(BioRouter).toSelf().inSingletonScope();
	container.bind(BioController).toSelf().inSingletonScope();
	container.bind(McpTool).to(BioTool).inSingletonScope();
	container.bind(BioRepository).to(PostgresBioRepository).inSingletonScope();
	container.bind(BioService).toSelf().inSingletonScope();

	// agent module
	container.bind(AgentRouter).toSelf().inSingletonScope();
	container.bind(AgentController).toSelf().inSingletonScope();
	container.bind(AgentModel).to(OpenRouterAgentModel).inSingletonScope();
	container.bind(ProfileRepository).to(BioProfileRepository).inSingletonScope();
	container
		.bind(ThreadRepository)
		.to(PostgresThreadRepository)
		.inSingletonScope();
	container
		.bind(MessageRepository)
		.to(PostgresMessageRepository)
		.inSingletonScope();
	container.bind(AgentService).toSelf().inSingletonScope();

	// auth module
	container
		.bind(Auth)
		.toResolvedValue((pg: Postgres) => createAuth(pg.pool), [Postgres])
		.inSingletonScope();
	container.bind(AuthPort).to(BetterAuthVerifier).inSingletonScope();
	container.bind(AuthController).toSelf().inSingletonScope();
	container.bind(AuthRouter).toSelf().inSingletonScope();

	// The tool names that require auth. Each module registers its own.
	container
		.bind(PrivateToolNames)
		.toConstantValue(new Set<string>(["create_bio", "update_bio"]));

	return container;
}
