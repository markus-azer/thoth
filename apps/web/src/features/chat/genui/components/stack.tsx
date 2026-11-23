"use client";

import { Stack } from "@thoth/genui";
import { withRenderer } from "../with-renderer";

const STACK_STYLE = "flex w-full flex-col gap-2";

export const StackRenderer = withRenderer(Stack, ({ props, renderNode }) => (
	<div className={STACK_STYLE}>{renderNode(props.children)}</div>
));
