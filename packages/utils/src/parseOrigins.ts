export const parseOrigins = (s: string): true | string[] =>
	s === "*" ? true : s.split(",").map((o) => o.trim());
