import { createFileRoute } from "@tanstack/react-router";
import { loadStaticBrowserData } from "../collections/static";
import { loadBrowserData } from "../collections/stream-db";
import { AppShell } from "../components/AppShell";
import { type BrowserSearch, parseBrowserSearch } from "../protocol/search";

export const Route = createFileRoute("/")({
	ssr: false,
	validateSearch: parseBrowserSearch,
	loaderDeps: ({ search }) => ({ capability: search.cap }),
	loader: ({ deps }) => {
		return deps.capability
			? loadBrowserData(deps.capability)
			: loadStaticBrowserData();
	},
	component: HomePage,
	pendingComponent: () => (
		<main className="route-loading">Opening workspace…</main>
	),
	errorComponent: ({ error }) => (
		<main className="route-error">{error.message}</main>
	),
});

function HomePage() {
	const data = Route.useLoaderData();
	const search = Route.useSearch();
	const navigateRoute = Route.useNavigate();
	const navigate = (next: Partial<BrowserSearch>, replace = false) => {
		navigateRoute({
			replace,
			search: (previous) => ({ ...previous, ...next }),
		});
	};
	return <AppShell data={data} search={search} navigate={navigate} />;
}
