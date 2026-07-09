import { createMiddleware } from "@promster/express";
import { parseOrigins } from "@wadjet/utils";
import cors from "cors";
import type { Application } from "express";
import helmet from "helmet";
import { inject, injectable } from "inversify";
import { pinoHttp } from "pino-http";
import swaggerUi from "swagger-ui-express";
import { env } from "~/env";
import { errorHandler } from "./error-handler";
import { generateOpenApiDocument } from "./openapi/registry";
import { pinoHttpOptions } from "./pino-http-options";
import { requestContext } from "./request-context";
import { HealthRouter } from "./routes/health.router";
import { WelcomeRouter } from "./routes/welcome.router";

@injectable()
export class AppRouter {
	constructor(
		@inject(WelcomeRouter) private readonly welcomeRouter: WelcomeRouter,
		@inject(HealthRouter) private readonly healthRouter: HealthRouter,
	) {}

	mount(app: Application): void {
		// CSP is enabled in prod. In dev/test it's disabled so the /docs Swagger UI works.
		app.use(helmet({ contentSecurityPolicy: env.isProd }));
		app.use(cors({ origin: parseOrigins(env.CORS_ORIGINS) }));
		// requestContext before pino-http: pino's logs carry requestId.
		app.use(requestContext);
		app.use(pinoHttp(pinoHttpOptions));
		app.use(createMiddleware({ app }));
		app.use("/", this.welcomeRouter.routes);
		app.use("/health", this.healthRouter.routes);

		if (!env.isProd) {
			const spec = generateOpenApiDocument();
			app.get("/openapi.json", (_req, res) => {
				res.json(spec);
			});
			app.use(
				"/docs",
				...swaggerUi.serve,
				swaggerUi.setup(spec, { customSiteTitle: "@wadjet/api" }),
			);
		}

		app.use(errorHandler);
	}
}
