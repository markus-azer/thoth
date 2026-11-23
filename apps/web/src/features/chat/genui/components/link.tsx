"use client";

import { Link } from "@thoth/genui";
import { withRenderer } from "../with-renderer";

const LINK_STYLE = "text-sm underline underline-offset-2";

const HTTPS_PREFIX = "https://";

const isHttps = (url: string) => url.startsWith(HTTPS_PREFIX);

export const LinkRenderer = withRenderer(Link, ({ props }) => {
	if (!isHttps(props.url)) {
		return <span>{props.label}</span>;
	}

	return (
		<a
			href={props.url}
			target="_blank"
			rel="noreferrer noopener"
			className={LINK_STYLE}
		>
			{props.label}
		</a>
	);
});
