import alegreyaCss from "@fontsource/alegreya/latin.css?url";
import alegreyaSansCss from "@fontsource/alegreya-sans/latin.css?url";
import figtreeCss from "@fontsource/figtree/latin.css?url";
import frauncesCss from "@fontsource/fraunces/latin.css?url";
import instrumentSansCss from "@fontsource/instrument-sans/latin.css?url";
import instrumentSerifCss from "@fontsource/instrument-serif/latin.css?url";
import interCss from "@fontsource/inter/latin.css?url";
import latoCss from "@fontsource/lato/latin.css?url";
import newsreaderCss from "@fontsource/newsreader/latin.css?url";
import playfairCss from "@fontsource/playfair-display/latin.css?url";
import sourceSansCss from "@fontsource/source-sans-3/latin.css?url";
import sourceSerifCss from "@fontsource/source-serif-4/latin.css?url";
import { Theme } from "@radix-ui/themes";
import radixCss from "@radix-ui/themes/styles.css?url";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Artifact Browser" },
		],
		links: [
			{ rel: "stylesheet", href: radixCss },
			{ rel: "stylesheet", href: interCss },
			{ rel: "stylesheet", href: sourceSerifCss },
			{ rel: "stylesheet", href: sourceSansCss },
			{ rel: "stylesheet", href: alegreyaCss },
			{ rel: "stylesheet", href: alegreyaSansCss },
			{ rel: "stylesheet", href: playfairCss },
			{ rel: "stylesheet", href: latoCss },
			{ rel: "stylesheet", href: frauncesCss },
			{ rel: "stylesheet", href: figtreeCss },
			{ rel: "stylesheet", href: newsreaderCss },
			{ rel: "stylesheet", href: instrumentSerifCss },
			{ rel: "stylesheet", href: instrumentSansCss },
			{ rel: "stylesheet", href: "./typography.css" },
			{ rel: "stylesheet", href: appCss },
		],
	}),
	component: RootComponent,
	notFoundComponent: NotFound,
});

function NotFound() {
	return <main className="route-error">Page not found.</main>;
}

function RootComponent() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Theme accentColor="amber" grayColor="sand" radius="small">
					<Outlet />
				</Theme>
				<Scripts />
			</body>
		</html>
	);
}
