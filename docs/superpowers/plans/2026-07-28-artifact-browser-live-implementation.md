# Artifact Browser Live Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a read-only local CLI and browser that exposes one filesystem root, streams watcher-derived metadata through StreamDB, and renders selected files with a polished Markdown-first interface.

**Architecture:** A small Node CLI starts a loopback HTTP server and an in-memory Durable Streams server on OS-assigned ports, creates a random session capability, and starts one Chokidar watcher with initial events enabled. The browser is a client-only TanStack Start SPA: it loads boot configuration, preloads metadata through StreamDB, queries it with TanStack DB, stores navigation in TanStack Router search parameters, and fetches file bodies through a capability-protected content API.

**Tech Stack:** TypeScript, Node.js, TanStack Start/Router/DB, Durable Streams/StreamDB, Chokidar, Radix UI, Capsize, React Markdown, remark-gfm, Mermaid, Shiki, Vitest, Testing Library.

## Global Constraints

- The filesystem is authoritative; StreamDB contains metadata and diagnostics only.
- Every run uses a fresh in-memory stream and random session capability.
- Both servers bind to loopback port `0`; never probe and bind later.
- The watcher performs initial enumeration; there is no separate scanner.
- Mark the workspace ready only after watcher `ready` and the metadata append queue drain.
- The UI is read-only and every content path remains inside the canonical root.
- TanStack Router search parameters own navigational UI state.
- TanStack DB owns metadata queries and persisted reader preferences.
- StreamDB runs in the browser only.
- The system browser opens by default; `--no-open` prints the same usable URL without opening it.
- Concrete semantic payload schemas, generic semantic views, and coverage matrices are deferred.

---

## File Structure

```text
artifact-browser/
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── src/
│   ├── cli/
│   │   ├── index.ts
│   │   └── options.ts
│   ├── server/
│   │   ├── runtime.ts
│   │   ├── http-server.ts
│   │   ├── watcher.ts
│   │   ├── path-policy.ts
│   │   └── metadata.ts
│   ├── protocol/
│   │   ├── schema.ts
│   │   └── types.ts
│   ├── collections/
│   │   ├── stream-db.ts
│   │   ├── content.ts
│   │   └── preferences.ts
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── FileTree.tsx
│   │   ├── Inspector.tsx
│   │   ├── Reader.tsx
│   │   └── ThemePicker.tsx
│   ├── renderers/
│   │   ├── registry.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   ├── StructuredRenderer.tsx
│   │   ├── TextRenderer.tsx
│   │   └── MediaRenderer.tsx
│   ├── routes/
│   │   ├── __root.tsx
│   │   └── index.tsx
│   ├── router.tsx
│   └── styles.css
└── test/
    ├── fixtures/
    └── setup.ts
```

### Task 1: Align Runtime Dependencies and Prove StreamDB/React Compatibility

**Files:**
- Modify: `artifact-browser/package.json`
- Modify: `artifact-browser/pnpm-lock.yaml`
- Modify: `artifact-browser/vite.config.ts`
- Create: `artifact-browser/vitest.config.ts`
- Create: `artifact-browser/test/setup.ts`
- Create: `artifact-browser/src/collections/stream-db.integration.test.tsx`

**Interfaces:**
- Consumes: `createStateSchema`, `createStreamDB`, and `DurableStreamTestServer`.
- Produces: one installed TanStack DB runtime shared by StreamDB and `@tanstack/react-db`; a passing React live-query smoke test.

- [ ] **Step 1: Add the runtime and test dependencies**

Add compatible releases of `@durable-streams/server`, `@durable-streams/client`, `@durable-streams/state`, `@tanstack/db`, `@tanstack/react-db`, `@tanstack/query-db-collection`, `@tanstack/react-query`, `zod`, `vitest`, `jsdom`, and Testing Library. Move packages used by the browser or CLI from `devDependencies` to `dependencies`. Use a pnpm override if needed so `pnpm ls @tanstack/db` reports one version.

- [ ] **Step 2: Add the Vitest browser-like environment**

Configure `vitest.config.ts` with `environment: "jsdom"` and load `test/setup.ts`. Add `test`, `test:watch`, and `typecheck` scripts.

- [ ] **Step 3: Write a failing compatibility test**

The test must:

1. start `DurableStreamTestServer({ host: "127.0.0.1", port: 0 })`;
2. create a JSON stream;
3. append one typed file insert event;
4. preload `createStreamDB`;
5. render a component using `useLiveQuery` against `db.collections.files`;
6. assert the file name appears;
7. close the DB and server in `finally`.

- [ ] **Step 4: Run the focused test**

Run: `pnpm vitest run src/collections/stream-db.integration.test.tsx`

Expected: PASS without duplicate DB instance or invalid collection errors.

- [ ] **Step 5: Verify the dependency graph**

Run: `pnpm ls @tanstack/db --depth 5`

Expected: every package resolves the same TanStack DB version.

- [ ] **Step 6: Commit**

```bash
git add artifact-browser/package.json artifact-browser/pnpm-lock.yaml artifact-browser/vite.config.ts artifact-browser/vitest.config.ts artifact-browser/test/setup.ts artifact-browser/src/collections/stream-db.integration.test.tsx
git commit -m "build: align artifact browser data runtime"
```

### Task 2: Define the Metadata Protocol and Root-Confinement Policy

**Files:**
- Create: `artifact-browser/src/protocol/types.ts`
- Create: `artifact-browser/src/protocol/schema.ts`
- Create: `artifact-browser/src/server/path-policy.ts`
- Create: `artifact-browser/src/server/metadata.ts`
- Create: `artifact-browser/src/server/path-policy.test.ts`
- Create: `artifact-browser/src/server/metadata.test.ts`

**Interfaces:**
- Produces: `WorkspaceRecord`, `FileRecord`, `ArtifactRecord`, `DiagnosticRecord`, `artifactStateSchema`, `resolveRootTarget(target)`, `resolveContentPath(root, relativePath)`, and `readFileMetadata(root, absolutePath, revision)`.

- [ ] **Step 1: Write confinement tests**

Cover a directory target, a file target, normalized relative paths, `..`,
absolute paths, null bytes, a symlink inside the root, and a symlink escaping the
root.

- [ ] **Step 2: Implement `path-policy.ts`**

Use `realpath`, `resolve`, and `relative`. Return:

```ts
interface ResolvedTarget {
  root: string
  initialPath: string | null
}
```

Reject any content candidate whose relative path starts with `..`, is absolute,
or resolves outside the root.

- [ ] **Step 3: Write metadata tests**

Assert stable root-relative IDs, parent paths, file/directory kinds, MIME types,
sizes, modified times, renderer IDs, and artifact metadata inferred from
Markdown frontmatter.

- [ ] **Step 4: Implement protocol schemas and metadata extraction**

Use synchronous Zod schemas compatible with Standard Schema. Parse only bounded
frontmatter; never send the body into a StreamDB record. Unknown or malformed
frontmatter returns a file record plus a diagnostic.

- [ ] **Step 5: Run tests**

Run: `pnpm vitest run src/server/path-policy.test.ts src/server/metadata.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add artifact-browser/src/protocol artifact-browser/src/server/path-policy.ts artifact-browser/src/server/metadata.ts artifact-browser/src/server/path-policy.test.ts artifact-browser/src/server/metadata.test.ts
git commit -m "feat: define artifact browser metadata protocol"
```

### Task 3: Build the Watcher-to-Stream Metadata Producer

**Files:**
- Create: `artifact-browser/src/server/watcher.ts`
- Create: `artifact-browser/src/server/watcher.integration.test.ts`

**Interfaces:**
- Consumes: `artifactStateSchema`, `readFileMetadata`.
- Produces:

```ts
interface MetadataWatcher {
  ready: Promise<void>
  close(): Promise<void>
}

function startMetadataWatcher(options: {
  root: string
  stream: DurableStream
  workspace: WorkspaceRecord
  ignores?: string[]
}): MetadataWatcher
```

- [ ] **Step 1: Write watcher integration tests**

Use a temporary directory and real Chokidar events. Assert initial `addDir` and
`add`, then change, unlink, and add. Resolve `ready` only after the stream
contains all initial records.

- [ ] **Step 2: Implement the watcher**

Use one Chokidar watcher with `ignoreInitial: false`. Convert `add`, `addDir`,
`change`, `unlink`, and `unlinkDir` into typed insert/upsert/delete events.
Coalesce bursts by relative path and use `IdempotentProducer`; `ready` awaits the
watcher event, pending metadata reads, and `producer.flush()`.

- [ ] **Step 3: Run the watcher test**

Run: `pnpm vitest run src/server/watcher.integration.test.ts`

Expected: PASS with no polling sleeps longer than the test timeout.

- [ ] **Step 4: Commit**

```bash
git add artifact-browser/src/server/watcher.ts artifact-browser/src/server/watcher.integration.test.ts
git commit -m "feat: stream live filesystem metadata"
```

### Task 4: Build the Capability-Protected Local Runtime and CLI

**Files:**
- Create: `artifact-browser/src/cli/options.ts`
- Create: `artifact-browser/src/cli/index.ts`
- Create: `artifact-browser/src/server/http-server.ts`
- Create: `artifact-browser/src/server/runtime.ts`
- Create: `artifact-browser/src/server/http-server.test.ts`
- Modify: `artifact-browser/package.json`

**Interfaces:**
- Consumes: `resolveRootTarget`, `startMetadataWatcher`.
- Produces:

```ts
interface BrowserRuntime {
  url: string
  close(): Promise<void>
}

function startBrowserRuntime(options: {
  target: string
  openBrowser: boolean
  staticDir: string
}): Promise<BrowserRuntime>
```

HTTP routes:

- `GET /api/boot?cap=...`
- `GET|HEAD /api/content?path=...&cap=...`
- `GET /api/download?path=...&cap=...`
- static SPA assets and `index.html` fallback.

- [ ] **Step 1: Write HTTP tests**

Assert both servers receive nonzero OS-assigned ports, boot config excludes the
absolute root, missing or incorrect capabilities return `401`, unexpected
origins return `403`, traversal returns `400`, ETags produce `304`, byte ranges
produce `206`, and `HEAD` returns headers without a body.

- [ ] **Step 2: Implement the HTTP server**

Use Node's HTTP primitives. Apply `Cache-Control: no-store` to boot data and
metadata, content type and ETag headers to files, bounded text handling, range
responses, CSP, `X-Content-Type-Options: nosniff`, and origin checks.

- [ ] **Step 3: Implement runtime composition**

Start `DurableStreamTestServer` with port `0`, start the app HTTP server with
port `0`, create a UUID capability and stream path, create the stream, start the
watcher, and construct the URL with the initial relative path in Router search
parameters.

- [ ] **Step 4: Implement CLI parsing**

Support:

```text
artifact-browser [path]
artifact-browser [path] --no-open
```

Print the URL before optional `open(url)`. Handle `SIGINT` and `SIGTERM` by
closing the watcher, producer, StreamDB server, and HTTP server once.

- [ ] **Step 5: Run focused tests**

Run: `pnpm vitest run src/server/http-server.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add artifact-browser/src/cli artifact-browser/src/server/http-server.ts artifact-browser/src/server/runtime.ts artifact-browser/src/server/http-server.test.ts artifact-browser/package.json
git commit -m "feat: add local artifact browser runtime"
```

### Task 5: Create Client Boot, StreamDB, Content, and Preference Collections

**Files:**
- Create: `artifact-browser/src/collections/stream-db.ts`
- Create: `artifact-browser/src/collections/content.ts`
- Create: `artifact-browser/src/collections/preferences.ts`
- Create: `artifact-browser/src/collections/preferences.test.ts`
- Modify: `artifact-browser/src/routes/index.tsx`

**Interfaces:**
- Produces:

```ts
interface BootConfig {
  workspaceName: string
  streamUrl: string
  capability: string
  initialPath: string | null
}

function loadBrowserData(capability: string): Promise<BrowserData>
function getContent(path: string, revision: string): Promise<FileContent>
const readerPreferencesCollection: Collection<ReaderPreferences>
```

- [ ] **Step 1: Write preference persistence tests**

Insert a font theme, recreate the collection against the same mocked
`localStorage`, and assert the theme survives.

- [ ] **Step 2: Implement the preferences collection**

Use `localStorageCollectionOptions`. Seed one record with ID `reader` and the
Source Serif pairing when no value exists.

- [ ] **Step 3: Implement client boot and StreamDB preload**

Fetch `/api/boot`, create StreamDB with the shared protocol schema, call
`preload()`, and return the DB plus a cleanup callback. Keep this code behind
`ssr: false`.

- [ ] **Step 4: Implement on-demand content**

Use the official query collection adapter and key requests by
`<path>@<revision>`. Return text, blob URL, MIME type, size, and ETag. Refuse to
parse oversized structured or diagram files.

- [ ] **Step 5: Run focused tests**

Run: `pnpm vitest run src/collections/preferences.test.ts src/collections/stream-db.integration.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add artifact-browser/src/collections artifact-browser/src/routes/index.tsx
git commit -m "feat: load artifact browser collections"
```

### Task 6: Replace the Starter with the Editorial Browser Shell

**Files:**
- Modify: `artifact-browser/src/routes/__root.tsx`
- Modify: `artifact-browser/src/routes/index.tsx`
- Modify: `artifact-browser/src/router.tsx`
- Create: `artifact-browser/src/components/AppShell.tsx`
- Create: `artifact-browser/src/components/FileTree.tsx`
- Create: `artifact-browser/src/components/Inspector.tsx`
- Modify: `artifact-browser/src/components/Header.tsx`
- Modify: `artifact-browser/src/components/ThemePicker.tsx`
- Delete: `artifact-browser/src/contexts/ThemeContext.tsx`
- Modify: `artifact-browser/src/styles.css`

**Interfaces:**
- Consumes: `BrowserData`, StreamDB collections, reader preferences.
- Produces typed Router search state:

```ts
interface BrowserSearch {
  cap: string
  file?: string
  q?: string
  type?: string
  inspector?: boolean
  view?: "rendered" | "source"
  expanded?: string
}
```

- [ ] **Step 1: Add search validation tests**

Assert invalid values fall back safely and compact expanded-directory state
round-trips.

- [ ] **Step 2: Implement typed Router search state**

Use `validateSearch`; use replace navigation for search typing and folder
toggles. The selected file and view remain copyable in the URL.

- [ ] **Step 3: Implement the shell**

Create a calm editorial layout with:

- a narrow utility header;
- a collapsible left file tree;
- a quiet central document canvas;
- an optional right inspector;
- keyboard-visible focus states;
- responsive single-pane behavior.

Use Radix props and CSS classes. Apply spacing to parent layout containers, not
text margins or line-height hacks.

- [ ] **Step 4: Implement live file queries**

Use `useLiveQuery` for hierarchy, type filters, title/path search, selected file,
workspace status, and diagnostics. Do not post-filter collection arrays in
JavaScript when a TanStack DB operator can express the query.

- [ ] **Step 5: Replace theme context with the preference collection**

Read the current preference with `useLiveQuery`, update the collection from the
picker, and apply font variables through one effect. Include Source Serif,
Alegreya, Playfair/Lato, Fraunces/Figtree, and Inter first; add Newsreader and
Instrument when their font packages are installed.

- [ ] **Step 6: Run checks**

Run: `pnpm typecheck && pnpm check`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add artifact-browser/src/routes artifact-browser/src/router.tsx artifact-browser/src/components artifact-browser/src/styles.css
git add -u artifact-browser/src/contexts/ThemeContext.tsx
git commit -m "feat: build the artifact browser shell"
```

### Task 7: Implement Markdown and Common File Renderers

**Files:**
- Create: `artifact-browser/src/renderers/registry.tsx`
- Create: `artifact-browser/src/renderers/MarkdownRenderer.tsx`
- Create: `artifact-browser/src/renderers/StructuredRenderer.tsx`
- Create: `artifact-browser/src/renderers/TextRenderer.tsx`
- Create: `artifact-browser/src/renderers/MediaRenderer.tsx`
- Create: `artifact-browser/src/components/Reader.tsx`
- Create: `artifact-browser/src/renderers/MarkdownRenderer.test.tsx`
- Modify: `artifact-browser/src/styles.css`

**Interfaces:**
- Produces:

```ts
interface RendererProps {
  file: FileRecord
  content: FileContent
  view: "rendered" | "source"
}

function selectRenderer(file: FileRecord): React.ComponentType<RendererProps>
```

- [ ] **Step 1: Write Markdown renderer tests**

Cover headings, GFM tables, task lists, fenced code, safe local links, local
images, blocked escaping links, sanitized HTML, and a Mermaid placeholder.

- [ ] **Step 2: Implement Markdown**

Use `react-markdown`, `remark-gfm`, sanitized raw HTML, Shiki code blocks, and a
client-only Mermaid component in strict mode. Rewrite relative content URLs to
the capability-protected API.

- [ ] **Step 3: Implement common renderers**

Provide:

- structured JSON/YAML tree and raw source;
- highlighted or plain text;
- images;
- audio/video with range-capable URLs;
- embedded PDF;
- sandboxed HTML without scripts or same-origin authority;
- CSV/TSV table with bounded rows;
- unknown-file metadata and download.

- [ ] **Step 4: Implement reader loading and failures**

Show bounded skeletons, preserve the selected path, use an error boundary per
renderer, and refetch when the selected file revision changes.

- [ ] **Step 5: Run tests and build**

Run: `pnpm vitest run src/renderers/MarkdownRenderer.test.tsx`

Run: `pnpm typecheck && pnpm build`

Expected: PASS and a generated SPA shell.

- [ ] **Step 6: Commit**

```bash
git add artifact-browser/src/renderers artifact-browser/src/components/Reader.tsx artifact-browser/src/styles.css
git commit -m "feat: render markdown and workspace files"
```

### Task 8: End-to-End Live Runtime Verification

**Files:**
- Create: `artifact-browser/test/fixtures/workspace/README.md`
- Create: `artifact-browser/test/fixtures/workspace/data.json`
- Create: `artifact-browser/test/fixtures/workspace/diagram.md`
- Modify: `artifact-browser/README.md`

**Interfaces:**
- Consumes: completed live CLI and SPA.
- Produces: documented commands and verified local runtime.

- [ ] **Step 1: Add representative fixtures**

Include typography, links, image references, GFM, code, Mermaid, JSON, and an
unsupported binary fixture.

- [ ] **Step 2: Run the complete automated suite**

Run: `pnpm test`

Run: `pnpm typecheck`

Run: `pnpm check`

Run: `pnpm build`

Expected: all commands pass.

- [ ] **Step 3: Start the CLI without opening a system browser**

Run: `pnpm artifact-browser test/fixtures/workspace --no-open`

Expected: prints one loopback URL containing a random capability and selected
workspace.

- [ ] **Step 4: Verify in the integrated browser**

Open the printed URL. Check the file tree, font switcher persistence, Markdown,
Mermaid, source toggle, local links/media, JSON view, responsive panels, and
keyboard focus.

- [ ] **Step 5: Verify live updates**

Edit a fixture file and confirm its reader updates without a page reload. Add and
delete a fixture file and confirm the tree updates.

- [ ] **Step 6: Document the live CLI**

Replace the starter README with install, build, run, `--no-open`, supported
renderers, security boundary, and current limitations.

- [ ] **Step 7: Commit**

```bash
git add artifact-browser/test/fixtures artifact-browser/README.md
git commit -m "docs: document the artifact browser"
```

