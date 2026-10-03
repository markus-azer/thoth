import "reflect-metadata";
import { ErrorCode, NotFound } from "@thoth/utils";
import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { errorHandler } from "~/infrastructure/http/error-handler";
import { BioRouter } from "~/infrastructure/http/index";
import { Bio } from "~/modules/bio/domain/bio";
import { BioController, type BioService } from "~/modules/bio/index";

const ada = new Bio({
	id: "1",
	handle: "ada",
	userId: "u1",
	name: "Ada Lovelace",
	headline: "First programmer",
	about: "Wrote the first algorithm.",
	createdAt: new Date(),
	updatedAt: new Date(),
});

const service = {
	get: async (handle: string | undefined) => {
		if (handle === "ada") return ada;
		throw new NotFound(ErrorCode.BIO_NOT_FOUND, "No bio");
	},
} as BioService;

function buildApp() {
	const app = express();
	app.use("/bio", new BioRouter(new BioController(service)).routes);
	app.use(errorHandler);
	return app;
}

describe("BioRouter", () => {
	it("RULE-BIO-013: `GET /bio/:handle` with a known handle → 200 with `{ name, headline, about }`.", async () => {
		const res = await request(buildApp()).get("/bio/ada");

		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			name: "Ada Lovelace",
			headline: "First programmer",
			about: "Wrote the first algorithm.",
		});
	});

	it("RULE-BIO-014: `GET /bio/:handle` with an unknown handle → 404 with code `BIO_NOT_FOUND`.", async () => {
		const res = await request(buildApp()).get("/bio/nobody");

		expect(res.status).toBe(404);
		expect(res.body.code).toBe("BIO_NOT_FOUND");
	});
});
