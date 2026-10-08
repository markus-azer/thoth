import { describe, expect, it } from "vitest";
import { GET } from "~/app/health/route";

describe("health", () => {
	it('RULE-WEB-001: The platform checks `/health` → it gets 200 with `{ status: "ok" }`.', async () => {
		const res = GET();
		const body = await res.json();

		expect(res.status).toBe(200);
		expect(body).toEqual({ status: "ok" });
	});
});
