import "pg";

// @types/pg lacks queryMode, which pg supports.
declare module "pg" {
	interface QueryConfig {
		queryMode?: "extended";
	}
}
