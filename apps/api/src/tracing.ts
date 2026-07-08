import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { env } from "~/env";

// SDK reads OTEL_* env vars directly (service name, endpoint, headers).
if (env.OTEL_ENABLED) {
	new NodeSDK({
		instrumentations: [getNodeAutoInstrumentations()],
	}).start();
}
