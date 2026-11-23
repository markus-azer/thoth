"use client";

import { createContext } from "react";

export type GenuiContextValue = {
	interactive: boolean;
};

export const GenuiContext = createContext<GenuiContextValue>({
	interactive: false,
});
