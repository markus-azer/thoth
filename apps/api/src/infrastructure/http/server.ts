import type { Server } from "node:http";
import express, { type Application } from "express";
import { inject, injectable } from "inversify";
import { env } from "~/env";
import type { Lifecycle } from "~/lifecycle/index";
import { log } from "~/logger";
import { AppRouter } from "./app-router";

@injectable()
export class HttpServer implements Lifecycle {
	readonly app: Application = express();
	private server!: Server;

	constructor(@inject(AppRouter) appRouter: AppRouter) {
		appRouter.mount(this.app);
	}

	async start(): Promise<void> {
		await new Promise<void>((resolve, reject) => {
			this.server = this.app.listen(env.PORT, () => {
				log.info("Server listening", { port: env.PORT });
				resolve();
			});
			this.server.once("error", reject);
		});
	}

	async stop(): Promise<void> {
		// HTTP keep-alive holds connections open after a request completes.
		// closeIdleConnections() clears those without aborting in-flight requests.
		const openBefore = await this.openConnectionCount();
		this.server.closeIdleConnections();
		const openAfter = await this.openConnectionCount();
		log.info("closed idle connections", { count: openBefore - openAfter });

		await new Promise<void>((resolve, reject) =>
			this.server.close((err) => (err ? reject(err) : resolve())),
		);
	}

	private openConnectionCount(): Promise<number> {
		return new Promise((resolve) =>
			this.server.getConnections((_err, count) => resolve(count ?? 0)),
		);
	}
}
