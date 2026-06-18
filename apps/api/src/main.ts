// Keep main.ts minimal. Bootstrapping only. Move setup logic to dedicated utils.
import { LifecycleManager } from "~/lifecycle";

const lifecycle = new LifecycleManager();

// graceful shutdown on SIGTERM/SIGINT
lifecycle.trapSignals();
lifecycle.trapFatals();

// start the app
await lifecycle.start();
