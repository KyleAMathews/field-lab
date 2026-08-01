import { eq, ilike, useLiveQuery } from "@tanstack/react-db";
import {
	BookOpen,
	Braces,
	Code2,
	FileText,
	FlaskConical,
	Search,
} from "lucide-react";
import type { ArtifactDatabase } from "../collections/stream-db";
import type { FieldLogProjection } from "../field-log/projection";
import { sourceLocalPath } from "../field-log/source-target";
import type { BrowserSearch } from "../protocol/search";
import type { FileRecord } from "../protocol/types";

function fileKind(file: FileRecord): string {
	if (file.name === "field_log.md") return "journal";
	if (file.rendererId === "image" || file.rendererId === "html")
		return "visualization";
	if (["json", "yaml", "yml", "csv", "tsv"].includes(file.extension ?? ""))
		return "raw-data";
	if (
		["js", "ts", "tsx", "jsx", "py", "go", "rs"].includes(file.extension ?? "")
	)
		return "code";
	if (/source|article|paper|transcript|reading/i.test(file.path))
		return "source";
	return "document";
}

function KindIcon({ kind }: { kind: string }) {
	if (kind === "readout") return <FlaskConical size={17} />;
	if (kind === "source") return <BookOpen size={17} />;
	if (kind === "code") return <Code2 size={17} />;
	if (kind === "raw-data") return <Braces size={17} />;
	return <FileText size={17} />;
}

export function ArtifactIndex({
	db,
	search,
	navigate,
	fieldLog,
	fieldLogPath,
}: {
	db: ArtifactDatabase;
	search: BrowserSearch;
	navigate: (next: Partial<BrowserSearch>, replace?: boolean) => void;
	fieldLog?: FieldLogProjection;
	fieldLogPath?: string;
}) {
	const { data: files = [] } = useLiveQuery(
		(query) => {
			let result = query
				.from({ file: db.collections.files })
				.where(({ file }) => eq(file.kind, "file"));
			if (search.aq) {
				result = result.where(({ file }) => ilike(file.path, `%${search.aq}%`));
			}
			return result.orderBy(({ file }) => file.path, "asc");
		},
		[db, search.aq],
	);
	const query = (search.aq ?? "").toLocaleLowerCase();
	const selectedKind = search.kind ?? "all";
	const selectedInstrument = search.instrument ?? "all";
	const readouts = (fieldLog?.entries ?? []).filter(
		(entry) =>
			entry.kind === "instrument" &&
			entry.readoutMarkdown &&
			(!query ||
				`${entry.title} ${entry.summary} ${entry.instrumentId}`
					.toLocaleLowerCase()
					.includes(query)) &&
			(selectedKind === "all" || selectedKind === "readout") &&
			(selectedInstrument === "all" ||
				entry.instrumentId === selectedInstrument),
	);
	const sources = (fieldLog?.sources ?? []).filter(
		(source) =>
			(!query ||
				`${source.title} ${source.url} ${source.origin}`
					.toLocaleLowerCase()
					.includes(query)) &&
			(selectedKind === "all" || selectedKind === "source") &&
			selectedInstrument === "all",
	);
	const visibleFiles = files.filter((file) => {
		const kind = fileKind(file);
		return (
			(selectedKind === "all" || kind === selectedKind) &&
			selectedInstrument === "all"
		);
	});
	const instruments = [
		...new Set(
			(fieldLog?.entries ?? [])
				.map((entry) => entry.instrumentId)
				.filter((value): value is string => Boolean(value)),
		),
	].sort();
	const knownPaths = new Set(files.map((file) => file.path));
	const count = readouts.length + sources.length + visibleFiles.length;

	return (
		<section className="artifact-index" aria-label="Artifacts">
			<header className="artifact-index-header">
				<div>
					<span className="eyebrow">Retrieval surface</span>
					<h1>Artifacts</h1>
					<p>
						Find a readout, source, map, file, or raw trace without leaving the
						trip.
					</p>
				</div>
				<span className="artifact-count">{count} results</span>
			</header>

			<div className="artifact-filters">
				<label className="artifact-search">
					<Search size={15} aria-hidden="true" />
					<input
						aria-label="Search artifacts"
						placeholder="Search titles, paths, and readouts"
						value={search.aq ?? ""}
						onChange={(event) =>
							navigate({ aq: event.target.value || undefined }, true)
						}
					/>
				</label>
				<label>
					<span>Kind</span>
					<select
						value={selectedKind}
						onChange={(event) =>
							navigate(
								{
									kind:
										event.target.value === "all"
											? undefined
											: event.target.value,
								},
								true,
							)
						}
					>
						<option value="all">All kinds</option>
						<option value="readout">Readouts</option>
						<option value="source">Sources</option>
						<option value="journal">Field logs</option>
						<option value="visualization">Visualizations</option>
						<option value="document">Documents</option>
						<option value="code">Code</option>
						<option value="raw-data">Raw data</option>
					</select>
				</label>
				<label>
					<span>Instrument</span>
					<select
						value={selectedInstrument}
						onChange={(event) =>
							navigate(
								{
									instrument:
										event.target.value === "all"
											? undefined
											: event.target.value,
								},
								true,
							)
						}
					>
						<option value="all">All instruments</option>
						{instruments.map((instrument) => (
							<option value={instrument} key={instrument}>
								{instrument}
							</option>
						))}
					</select>
				</label>
			</div>

			<div className="artifact-results">
				{readouts.map((entry) => (
					<button
						className="artifact-result"
						type="button"
						key={`readout-${entry.id}`}
						onClick={() =>
							navigate({
								page: undefined,
								file: fieldLogPath,
								readout: String(entry.runId),
								entry: entry.id,
							})
						}
					>
						<KindIcon kind="readout" />
						<span className="artifact-result-copy">
							<strong>{entry.title}</strong>
							<span>{entry.summary}</span>
							<small>
								Readout · {entry.instrumentId} · {entry.status}
							</small>
						</span>
					</button>
				))}
				{sources.map((source) => {
					const localPath = fieldLogPath
						? sourceLocalPath(source, fieldLogPath, knownPaths)
						: undefined;
					return fieldLogPath ? (
						<button
							className="artifact-result"
							type="button"
							key={source.id}
							onClick={() =>
								navigate({
									page: undefined,
									file: fieldLogPath,
									source: source.id,
									entry: undefined,
									readout: undefined,
								})
							}
						>
							<KindIcon kind="source" />
							<span className="artifact-result-copy">
								<strong>{source.title}</strong>
								<span>{source.url ?? localPath ?? source.origin}</span>
								<small>
									Source · {source.origin} · {source.coverage}
								</small>
							</span>
						</button>
					) : (
						<div className="artifact-result" key={source.id}>
							<KindIcon kind="source" />
							<span className="artifact-result-copy">
								<strong>{source.title}</strong>
								<small>Source · {source.coverage}</small>
							</span>
						</div>
					);
				})}
				{visibleFiles.map((file) => {
					const kind = fileKind(file);
					return (
						<button
							className="artifact-result"
							type="button"
							key={file.id}
							onClick={() =>
								navigate({
									page: undefined,
									file: file.path,
									entry: undefined,
									readout: undefined,
								})
							}
						>
							<KindIcon kind={kind} />
							<span className="artifact-result-copy">
								<strong>{file.name}</strong>
								<span>{file.path}</span>
								<small>
									{kind} · {file.extension ?? file.rendererId} ·{" "}
									{file.size?.toLocaleString() ?? 0} bytes
								</small>
							</span>
						</button>
					);
				})}
			</div>
		</section>
	);
}
