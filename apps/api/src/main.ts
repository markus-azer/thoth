// Keep main.ts minimal. Bootstrapping only. Move setup logic to dedicated utils.
import { tracing } from "~/tracing"; // OpenTelemetry SDK, must load before instrumented modules
import "reflect-metadata";
import { createContainer } from "~/di/index";
import { Postgres } from "~/infrastructure/db/index";
import { HttpServer, MetricsServer } from "~/infrastructure/http/index";
import { LifecycleManager } from "~/lifecycle";
import { HealthService } from "~/modules/health/index";

const container = await createContainer();

const lifecycle = new LifecycleManager();
// Tracing stops last so shutdown-time spans still flush.
lifecycle.register(tracing);
// Metrics next: observable during the rest of the boot.
lifecycle.register(container.get(MetricsServer));
lifecycle.register(container.get(Postgres));
lifecycle.register(container.get(HttpServer));
// last: starts ready after server up, stops first to drain
lifecycle.register(container.get(HealthService));

// graceful shutdown on SIGTERM/SIGINT
lifecycle.trapSignals();
lifecycle.trapFatals();

// start the app
await lifecycle.start();
