# Artifact Browser

A read-only browser for working-session artifacts. Point the CLI at any file or
directory. It opens a Markdown-first reader and keeps its file metadata current
as the workspace changes.

## Run

```bash
pnpm install
pnpm build
pnpm artifact-browser .
```

The CLI asks the operating system for open loopback ports. It prints the URL
before opening the system browser. In Codex or another integrated browser:

```bash
pnpm artifact-browser . --no-open
```

A file target uses its parent as the workspace and selects the file:

```bash
pnpm artifact-browser notes/session.md --no-open
```

## What it reads

- Markdown and GFM, with sanitized HTML, Mermaid, and TanStack Highlight
- JSON and YAML
- CSV and TSV
- plain text and source files
- images, audio, video, and PDF
- sandboxed HTML
- unknown files as metadata plus a download

Markdown can carry optional `artifact` frontmatter. Ordinary files need no
special metadata. The browser keeps content on demand; Durable Streams carries
only file, artifact, workspace, and diagnostic metadata.

## Navigation and preferences

The selected file, search, view, expanded directories, and inspector state live
in URL query parameters. Font pairing preferences persist in `localStorage`.

## Field Logs

Selecting `field_log.md` opens a wide Field Log view:

- current questions, sources, terms, tensions, plan, and lineage at the top;
- exact user comments and instrument results in chronological order below;
- full structured readouts in a route-controlled reader;
- a faceted Artifacts page for readouts, sources, files, maps, and raw data.

Legacy Markdown Field Logs are projected directly. A new compound Field Log
uses `field_log.jsonl` as its canonical event stream and `field_log.md` as its
generated portable reading copy.

Create and update compound logs through the writer:

```bash
pnpm field-log init ./field-trip-topic --json '{"type":"trip.created",...}'
pnpm field-log append ./field-trip-topic --json '[{"type":"comment.recorded",...}]'
pnpm field-log validate ./field-trip-topic
pnpm field-log render ./field-trip-topic
pnpm field-log link ./field-trip-topic --entry 4 --readout 3
```

The writer assigns event, entity, entry, and run IDs plus timestamps. It uses
XState to validate transitions, checks an instrument card's inline JSON Schema
when present, serializes concurrent writers with a trip lock, appends JSONL,
syncs the canonical append, and overwrites Markdown from the full stream. Failed
validation changes neither file. If the append commits but Markdown replacement
fails, the receipt includes `projectionWarning`; run `field-log render` to
repair the reading copy. `--stdin` and `--file` are available for unusually
large events.

User-gated events also require their allowed authorization kind, a user-turn
pointer, and the user's exact authorizing words in `authorization.verbatim`.
See `reference/field-log-events.md` for the event-to-kind mapping.

## Security boundary

Both servers bind to loopback. Each run gets a random capability. The file tree
stays rooted at the selected workspace, while validated `source.collected`
records may open their exact absolute files elsewhere on the local computer.
The writer copies sources from Desktop, Downloads, and the operating system's
temporary directory into the Field Trip and records their original locations.
Copying does not grant publication rights: static builds omit those bytes until
the user authorizes publication. Other absolute files are rejected. External
files pass through the same capability-protected, read-only content server.
Unexpected browser origins are rejected. The separate `field-log` CLI is the
sole Field Log mutation path.

The first release does not defend against an attacker who can swap filesystem
entries during a single open operation. It also treats unknown semantic schemas
as generic structured data.

## Development

```bash
pnpm test
pnpm typecheck
pnpm check
pnpm build
```

The sample workspace is under `test/fixtures/workspace`.

## Publish

Build a static package from explicit entries:

```bash
pnpm build
pnpm artifact-browser publish post.md --out ./published
```

The output contains the reader, a versioned manifest, and content-addressed
copies of each entry. Markdown embedded media is included. Publishing a
compound Field Log also includes its declared JSONL event stream. Ordinary
links are not crawled. Structured JSON or YAML may include an explicit
`references` array.

Field Log sources inside the trip directory are included. An outside local
source remains metadata-only unless the event stream contains a later
`source.publication.authorized` event with `publication-consent`, a user-turn
pointer, and the user's exact authorizing words.

A directory entry includes only artifacts whose frontmatter exposure is
`public`. Broaden that rule when needed:

```bash
pnpm artifact-browser publish ./posts \
  --out ./published \
  --include-exposure public,checkpoint
```

Use `--force` to replace an existing output after the new package validates.
Serve the package at the static host's root. It makes no request to the live
content or stream APIs. Configurable nested-path routing is not yet included.
