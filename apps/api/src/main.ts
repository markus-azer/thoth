// Keep main.ts minimal. Bootstrapping only. Move setup logic to dedicated utils.
import "reflect-metadata";
import { createContainer } from "~/di/index";
import { Postgres } from "~/infrastructure/db/index";
import { HttpServer, MetricsServer } from "~/infrastructure/http/index";
import { LifecycleManager } from "~/lifecycle";

const container = await createContainer();

const lifecycle = new LifecycleManager();
// Metrics first: observable during the rest of the boot.
lifecycle.register(container.get(MetricsServer));
lifecycle.register(container.get(Postgres));
lifecycle.register(container.get(HttpServer));

// graceful shutdown on SIGTERM/SIGINT
lifecycle.trapSignals();
lifecycle.trapFatals();

// start the app
await lifecycle.start();
