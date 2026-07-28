import { eq, useLiveQuery } from "@tanstack/react-db";
import type { ArtifactDatabase } from "../collections/stream-db";
import type { FileRecord } from "../protocol/types";

export function Inspector({
	db,
	file,
}: {
	db: ArtifactDatabase;
	file: FileRecord | undefined;
}) {
	const { data: artifacts = [] } = useLiveQuery(
		(query) =>
			file
				? query
						.from({ artifact: db.collections.artifacts })
						.where(({ artifact }) => eq(artifact.fileId, file.id))
				: undefined,
		[db, file?.id],
	);
	const { data: diagnostics = [] } = useLiveQuery(
		(query) =>
			file
				? query
						.from({ diagnostic: db.collections.diagnostics })
						.where(({ diagnostic }) => eq(diagnostic.fileId, file.id))
				: undefined,
		[db, file?.id],
	);
	const artifact = artifacts[0];
	return (
		<aside className="inspector" aria-label="File details">
			<div className="inspector-section">
				<span className="eyebrow">File</span>
				<dl>
					<dt>Path</dt>
					<dd>{file?.path ?? "—"}</dd>
					<dt>Type</dt>
					<dd>{file?.mimeType ?? file?.kind ?? "—"}</dd>
					<dt>Size</dt>
					<dd>
						{file?.size == null ? "—" : `${file.size.toLocaleString()} bytes`}
					</dd>
				</dl>
			</div>
			{artifact ? (
				<div className="inspector-section">
					<span className="eyebrow">Artifact</span>
					<dl>
						<dt>Role</dt>
						<dd>{artifact.role}</dd>
						<dt>Shape</dt>
						<dd>{artifact.representation}</dd>
						<dt>Mode</dt>
						<dd>{artifact.renderingMode}</dd>
						<dt>Exposure</dt>
						<dd>{artifact.exposure}</dd>
						<dt>Instrument</dt>
						<dd>{artifact.instrumentId ?? "—"}</dd>
					</dl>
				</div>
			) : null}
			{diagnostics.length > 0 ? (
				<div className="inspector-section">
					<span className="eyebrow">Diagnostics</span>
					{diagnostics.map((item) => (
						<p className="diagnostic" key={item.id}>
							{item.message}
						</p>
					))}
				</div>
			) : null}
		</aside>
	);
}
