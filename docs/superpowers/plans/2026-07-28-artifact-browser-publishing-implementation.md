# Artifact Browser Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fail-closed `publish` command that packages explicit Markdown entries, embedded local media, metadata, and the complete static reader into a deployable directory.

**Architecture:** The publisher reuses the live runtime's path policy, metadata extraction, and renderer registry. It walks only explicit Markdown media and explicit structured references, validates exposure and root confinement, writes content-addressed assets and a static manifest into a temporary sibling directory, copies the complete prebuilt SPA renderer bundle, then atomically installs the output.

**Tech Stack:** TypeScript, Node.js, TanStack DB static collections, TanStack Router hash/query navigation, React Markdown, Vite/TanStack Start SPA output, Vitest.

## Global Constraints

- Publishing is read-only with respect to source files.
- Explicit files are entry points; a directory includes only `public` artifacts.
- Plain files without exposure metadata require explicit selection.
- Markdown embedded media and explicit structured references are the only inferred dependencies in v1.
- Ordinary hyperlinks do not copy their targets.
- Arbitrary HTML, CSS, scripts, and generated URL dependency discovery is out of scope.
- Every included path must remain inside the canonical root.
- The complete normally tree-shaken renderer bundle ships in every publication.
- Output is staged and installed only after validation; failures leave an existing destination unchanged.
- Published output makes no request to a live application, content, or stream API.

---

### Task 1: Define and Test the Static Manifest

**Files:**
- Create: `artifact-browser/src/publishing/manifest.ts`
- Create: `artifact-browser/src/publishing/manifest.test.ts`

**Interfaces:**
- Produces `PublishedManifest`, `PublishedFile`, `PublishedArtifact`, and
  `validatePublishedManifest(value)`.

- [ ] Write failing schema tests for version, entries, routes, metadata,
  content-addressed paths, MIME types, and diagnostics.
- [ ] Implement a versioned Zod manifest schema using root-relative paths only.
- [ ] Run `pnpm vitest run src/publishing/manifest.test.ts`.
- [ ] Commit with `git commit -m "feat: define static artifact manifest"`.

### Task 2: Collect Fail-Closed Publication Dependencies

**Files:**
- Create: `artifact-browser/src/publishing/collect.ts`
- Create: `artifact-browser/src/publishing/collect.test.ts`

**Interfaces:**
- Produces:

```ts
function collectPublication(options: {
  root: string
  entries: string[]
  includeExposure: Array<"public" | "checkpoint" | "internal">
}): Promise<PublicationPlan>
```

- [ ] Write fixtures and failing tests for explicit Markdown, embedded local
  images, ordinary links, escaping media, missing media, public directory
  selection, and private exposure.
- [ ] Parse Markdown AST image/media nodes and explicit structured references;
  do not crawl ordinary hyperlinks or HTML/CSS/JS.
- [ ] Return a complete plan plus diagnostics without writing output.
- [ ] Run `pnpm vitest run src/publishing/collect.test.ts`.
- [ ] Commit with `git commit -m "feat: collect publication dependencies"`.

### Task 3: Build and Install the Static Package

**Files:**
- Create: `artifact-browser/src/publishing/build.ts`
- Create: `artifact-browser/src/publishing/build.integration.test.ts`
- Modify: `artifact-browser/src/cli/options.ts`
- Modify: `artifact-browser/src/cli/index.ts`
- Modify: `artifact-browser/package.json`

**Interfaces:**
- Produces:

```ts
function buildPublication(options: {
  plan: PublicationPlan
  output: string
  staticAppDir: string
  force: boolean
}): Promise<PublishedManifest>
```

- [ ] Write an integration test proving content hashing, relative URLs, complete
  renderer bundle copy, manifest integrity, and unchanged destination after a
  forced validation failure.
- [ ] Stage beside the output, copy the prebuilt SPA, write hashed contents and
  manifest, validate all manifest references, then rename into place.
- [ ] Add `artifact-browser publish <entry...> --out <directory> [--force]` and
  explicit exposure override flags.
- [ ] Run `pnpm vitest run src/publishing/build.integration.test.ts`.
- [ ] Commit with `git commit -m "feat: publish static artifact packages"`.

### Task 4: Add the Static Data Adapter

**Files:**
- Create: `artifact-browser/src/collections/static.ts`
- Modify: `artifact-browser/src/routes/index.tsx`
- Modify: `artifact-browser/src/router.tsx`
- Create: `artifact-browser/src/collections/static.test.ts`

**Interfaces:**
- Produces `loadStaticBrowserData(manifestUrl)` with the same read interface the
  shell receives from live `BrowserData`.

- [ ] Write a failing test loading a fixture manifest into read-only TanStack DB
  collections.
- [ ] Select the static adapter when the built shell contains a publication boot
  marker; otherwise use live boot and StreamDB.
- [ ] Resolve content through relative hashed URLs and use hash/query navigation
  without server rewrites.
- [ ] Run `pnpm vitest run src/collections/static.test.ts`.
- [ ] Commit with `git commit -m "feat: load published artifact manifests"`.

### Task 5: Verify a Published Dialectic Press Post

**Files:**
- Create: `artifact-browser/test/fixtures/publication/post.md`
- Create: `artifact-browser/test/fixtures/publication/image.svg`
- Modify: `artifact-browser/README.md`

**Interfaces:**
- Consumes: `artifact-browser publish`.
- Produces: a tested, documented static package.

- [ ] Create a representative Markdown blog post with local media and an
  ordinary external link.
- [ ] Build the SPA, publish the fixture, and serve the output with a plain
  static HTTP server.
- [ ] Verify in the integrated browser that typography, navigation, media, and
  source/rendered views match live mode.
- [ ] Inspect network requests and assert none target `/api/*` or a Durable
  Stream.
- [ ] Add publishing usage, exposure behavior, dependency limits, nested-path
  hosting, and deployment notes to the README.
- [ ] Run `pnpm test && pnpm typecheck && pnpm check && pnpm build`.
- [ ] Commit with `git commit -m "docs: document static artifact publishing"`.

