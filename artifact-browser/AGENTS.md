# Kyle's Stack

A starter for building apps with TanStack Start, Radix UI, and capsize typography.

## Stack

- **TanStack Start** - Full-stack React framework (SPA/SSR, deploys everywhere)
- **Radix UI** - Accessible component library with themes
- **vite-plugin-capsize-radix** - Pixel-perfect typography
- **Dozens of font pairings included** - Ask the agent to set one up

## Project Structure

```
src/
├── components/
│   ├── Header.tsx        # App header with ThemePicker
│   └── ThemePicker.tsx   # Font theme dropdown
├── contexts/
│   └── ThemeContext.tsx  # Font theme state + CSS variable switching
├── routes/
│   ├── __root.tsx        # Root layout, CSS imports, Theme wrapper
│   └── index.tsx         # Home page
├── router.tsx
└── styles.css            # CSS custom properties for fonts
```

## Styling Rules

### No spacing props on text elements

Capsize normalizes text boxes to actual glyph bounds (no extra leading), so spacing between text elements must be controlled via `gap` on the parent container—not margins, padding, or line-height on the text itself.

```tsx
// ❌ DON'T - line-height hacks, margins, or padding on text
<Heading style={{ lineHeight: 1.3 }}>
<Heading mb="2">
<Heading pb="1">

// ✅ DO - use gap on parent Flex container
<Flex direction="column" gap="3">
  <Heading>Title</Heading>
  <Text>Content</Text>
</Flex>
```

### Spacing scale

Radix uses 1-9 scale:
- `gap="2"` - Tight (related items)
- `gap="3"` - Default
- `gap="4"` - Comfortable
- `gap="6"` - Section separation

### Avoid inline styles

Use Radix props instead of `style={{}}`. When unsure how to style something, look up the Radix docs at https://www.radix-ui.com/themes/docs

### State management (TanStack DB only)

Use TanStack DB for all state. For client-only UI state, use a local-only collection. Never use `useState`.

## Available Themes

| ID | Name | Fonts | Vibe |
|----|------|-------|------|
| inter | Inter | Inter | Clean & modern |
| source | Source Serif | Source Serif 4 + Source Sans 3 | Elegant editorial |
| alegreya | Alegreya | Alegreya + Alegreya Sans | Literary & warm |
| playfair | Playfair + Lato | Playfair Display + Lato | Classic craft |
| fraunces | Fraunces + Figtree | Fraunces + Figtree | Modern wonky |

Dozens more font pairings available. See https://github.com/KyleAMathews/vite-plugin-capsize-radix-ui/blob/main/SKILL.md for the full list.

## Adding Routes

Create new routes in `src/routes/`:

```tsx
// src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Container, Flex, Heading, Text } from '@radix-ui/themes'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <Container size="2" py="6">
      <Flex direction="column" gap="4">
        <Heading size="8">About</Heading>
        <Text>Your content here.</Text>
      </Flex>
    </Container>
  )
}
```

## Included Skills

Skills ship inside the library packages via `@tanstack/intent`. To list all available skills:

```bash
npx @tanstack/intent@latest list
```

<!-- intent-skills:start -->
# Skill mappings — when working in these areas, load the linked skill file into context.

### TanStack DB (`@tanstack/db`, `@tanstack/react-db`)

- **Setting up collections or adding a new data source** → `node_modules/@tanstack/db/skills/db-core/collection-setup/SKILL.md`
- **Writing live queries, filtering, joining, or aggregating data** → `node_modules/@tanstack/db/skills/db-core/live-queries/SKILL.md`
- **Mutations, optimistic updates, or server sync** → `node_modules/@tanstack/db/skills/db-core/mutations-optimistic/SKILL.md`
- **Building a custom collection adapter** → `node_modules/@tanstack/db/skills/db-core/custom-adapter/SKILL.md`
- **TanStack DB overview or general questions** → `node_modules/@tanstack/db/skills/db-core/SKILL.md`
- **Integrating DB with TanStack Start or other meta-frameworks** → `node_modules/@tanstack/db/skills/meta-framework/SKILL.md`
- **Using TanStack DB in React (useLiveQuery, hooks)** → `node_modules/@tanstack/react-db/skills/react-db/SKILL.md`
- **Offline support and transaction persistence** → `node_modules/@tanstack/offline-transactions/skills/offline/SKILL.md`

### Electric (`@electric-sql/client`)

- **Adding a new synced feature end-to-end** → `node_modules/@electric-sql/client/skills/electric-new-feature/SKILL.md`
- **Configuring shapes, ShapeStream, or sync options** → `node_modules/@electric-sql/client/skills/electric-shapes/SKILL.md`
- **Designing Postgres schema and shape definitions** → `node_modules/@electric-sql/client/skills/electric-schema-shapes/SKILL.md`
- **Using Electric with Drizzle or Prisma** → `node_modules/@electric-sql/client/skills/electric-orm/SKILL.md`
- **Debugging sync issues** → `node_modules/@electric-sql/client/skills/electric-debugging/SKILL.md`
- **Postgres security for Electric** → `node_modules/@electric-sql/client/skills/electric-postgres-security/SKILL.md`
- **Setting up auth proxy** → `node_modules/@electric-sql/client/skills/electric-proxy-auth/SKILL.md`
- **Deploying Electric** → `node_modules/@electric-sql/client/skills/electric-deployment/SKILL.md`

### Durable Streams (`@durable-streams/client`, `@durable-streams/state`)

- **Getting started with Durable Streams** → `node_modules/@durable-streams/client/skills/getting-started/SKILL.md`
- **Reading from streams (stream(), LiveMode, cursors)** → `node_modules/@durable-streams/client/skills/reading-streams/SKILL.md`
- **Writing data (append, IdempotentProducer)** → `node_modules/@durable-streams/client/skills/writing-data/SKILL.md`
- **Server deployment (dev server, Caddy)** → `node_modules/@durable-streams/client/skills/server-deployment/SKILL.md`
- **Production readiness checklist** → `node_modules/@durable-streams/client/skills/go-to-production/SKILL.md`
- **Defining state schemas** → `node_modules/@durable-streams/state/skills/state-schema/SKILL.md`
- **Stream-backed reactive database (createStreamDB)** → `node_modules/@durable-streams/state/skills/stream-db/SKILL.md`
<!-- intent-skills:end -->

## Skills

A skill is a set of local instructions in a `SKILL.md` file.

### Available skills

- `frontend-design` - Create distinctive, production-grade frontend interfaces with high design quality. (file: skills/frontend-design/SKILL.md)
