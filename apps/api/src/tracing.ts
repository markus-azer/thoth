import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { env } from "~/env";
import type { Lifecycle } from "~/lifecycle/index";

const sdk = new NodeSDK({
	instrumentations: [getNodeAutoInstrumentations()],
});

// Auto-instrumentation must patch modules before they load.
// SDK reads OTEL_* env vars directly (service name, endpoint, headers).
if (env.OTEL_ENABLED) sdk.start();

export const tracing: Lifecycle = {
	async start() {},
	async stop() {
		if (env.OTEL_ENABLED) await sdk.shutdown();
	},
};
