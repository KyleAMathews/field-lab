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

- Markdown and GFM, with sanitized HTML, Mermaid, and highlighted code
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

## Security boundary

Both servers bind to loopback. Each run gets a random capability. Content paths
are canonicalized against the workspace root, and escaping symlinks, absolute
paths, traversal, and unexpected browser origins are rejected. The browser is
read-only.

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
copies of each entry. Markdown embedded media is included. Ordinary links are
not crawled. Structured JSON or YAML may include an explicit `references`
array.

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
