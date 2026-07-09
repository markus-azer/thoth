import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import type { Postgres } from "~/infrastructure/db/index";
import { HealthService } from "~/modules/health/index";

const setup = () => {
	const ping = vi.fn().mockResolvedValue(true);
	return { service: new HealthService({ ping } as unknown as Postgres), ping };
};

describe("HealthService", () => {
	it('RULE-HEALTH-001: `/health/live` returns 200 with `{ status: "ok" }`', () => {
		const { service } = setup();
		expect(service.live()).toEqual({ status: "ok" });
	});

	it('RULE-HEALTH-002: `/health/ready` returns 200 with `{ status: "ok", checks: { db: "ok" } }` when the service is started and the DB responds', async () => {
		const { service } = setup();
		await service.start();
		await expect(service.ready()).resolves.toEqual({
			status: "ok",
			checks: { db: "ok" },
		});
	});

	it('RULE-HEALTH-003: `/health/ready` returns 503 with `status: "degraded"` before `start()`', async () => {
		const { service } = setup();
		const result = await service.ready();
		expect(result.status).toBe("degraded");
	});

	it('RULE-HEALTH-004: `/health/ready` returns 503 with `status: "degraded"` after `stop()`', async () => {
		const { service } = setup();
		await service.start();
		await service.stop();
		const result = await service.ready();
		expect(result.status).toBe("degraded");
	});

	it('RULE-HEALTH-005: `setReady(false)` forces `status: "degraded"`', async () => {
		const { service } = setup();
		await service.start();
		service.setReady(false);
		const result = await service.ready();
		expect(result.status).toBe("degraded");
	});

	it('RULE-HEALTH-006: A failing DB ping sets `checks.db` to `"degraded"`', async () => {
		const { service, ping } = setup();
		ping.mockResolvedValueOnce(false);
		await service.start();
		const result = await service.ready();
		expect(result.checks.db).toBe("degraded");
	});

	it('RULE-HEALTH-007: A failing DB ping forces `status: "degraded"`', async () => {
		const { service, ping } = setup();
		ping.mockResolvedValueOnce(false);
		await service.start();
		const result = await service.ready();
		expect(result.status).toBe("degraded");
	});
});
