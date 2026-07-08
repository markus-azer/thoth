// Keep main.ts minimal. Bootstrapping only. Move setup logic to dedicated utils.
import "reflect-metadata";
import { createContainer } from "~/di/index";
import { MetricsServer } from "~/infrastructure/http/index";
import { LifecycleManager } from "~/lifecycle";

const container = await createContainer();

const lifecycle = new LifecycleManager();
lifecycle.register(container.get(MetricsServer));

// graceful shutdown on SIGTERM/SIGINT
lifecycle.trapSignals();
lifecycle.trapFatals();

// start the app
await lifecycle.start();
