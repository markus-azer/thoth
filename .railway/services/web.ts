import { github, service } from "railway/iac";

const amsterdam = "europe-west4-drams3a";

export function web() {
	return service("web", {
		source: github("markus-azer/thoth"),
		build: {
			builder: "DOCKERFILE",
			dockerfilePath: "apps/web/Dockerfile",
			watchPatterns: [
				"/apps/web/**",
				"/packages/**",
				"/package.json",
				"/pnpm-lock.yaml",
				"/pnpm-workspace.yaml",
				"/turbo.json",
				"/tsconfig.base.json",
			],
		},
		deploy: { restartPolicyType: "ON_FAILURE", restartPolicyMaxRetries: 3 },
		healthcheck: "/health",
		healthcheckTimeout: 30,
		replicas: { [amsterdam]: 1 },
		env: {
			// biome-ignore lint/style/useNamingConvention: environment variable name
			// biome-ignore lint/suspicious/noTemplateCurlyInString: Railway reference syntax
			API_URL: "https://${{api.RAILWAY_PUBLIC_DOMAIN}}",
			// biome-ignore lint/style/useNamingConvention: environment variable name
			SITE_HANDLE: "markus-azer",
		},
	});
}
