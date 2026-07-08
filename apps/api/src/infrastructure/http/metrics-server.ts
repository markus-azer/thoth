import type { Server } from "node:http";
import { getContentType, getSummary } from "@promster/express";
import express from "express";
import { injectable } from "inversify";
import { env } from "~/env";
import type { Lifecycle } from "~/lifecycle/index";

@injectable()
export class MetricsServer implements Lifecycle {
	private server!: Server;

	async start(): Promise<void> {
		const app = express();

		app.get("/metrics", async (_req, res) => {
			const contentType = getContentType();
			const body = await getSummary();

			res.setHeader("Content-Type", contentType);
			res.end(body);
		});

		app.get("/health/live", (_req, res) => {
			res.json({ status: "ok" });
		});

		await new Promise<void>((resolve) => {
			this.server = app.listen(env.METRICS_PORT, () => resolve());
		});
	}

	async stop(): Promise<void> {
		await new Promise<void>((resolve, reject) =>
			this.server.close((err) => (err ? reject(err) : resolve())),
		);
	}
}
