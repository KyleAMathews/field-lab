# Research Subagent Prompt Contract

When the dialectic needs research — during Phase 1 grounding, and on every **Research** exit of the refinement loop (the 4.9 router) — the orchestrator spawns targeted research subagents. This doc is their standard output contract.

The **gardener consumes drafts in this exact format**, so the contract *is* the interface between the research subagents and the gardener. Research subagents write page-shaped drafts to the staging directory and return their paths. The orchestrator reads those files (it needs the research for the live conversation) and hands the same paths to the gardener, which ingests them into the wiki (`reference/dialectic-wiki.md`). A research subagent never touches the wiki itself — drafting to files rather than inline prose keeps the research durable and gardener-ingestible.

## The six slots

1. **Target.** A *specific* search directive — "search for X's argument about Y, the part about Z" — not "research this topic." (Same discipline the skill already requires of research directives.)
2. **Gap tag.** The open question this research is meant to close, verbatim. It is stamped on every page the agent drafts (the intent tag), so the wiki stays navigable — every fact remembers why it was pulled.
3. **Output contract.** **Write 1–N page-draft files to the staging directory and return their paths.** Prefer files over a long inline report — the files are durable, the gardener ingests them, and the orchestrator reads the files it needs. A short synopsis in the return message is fine, but the substance lives in the page files.
4. **Page format.** Each draft file is one page:
   - **Frontmatter (valid YAML `---` block — the canonical schema in `reference/dialectic-wiki.md`):** `type: concept|source`, `title`, `provenance` (this agent + round + source), `gap` (verbatim, from slot 2), `date`. Real YAML, not bold-prose headers — the gardener and firewall parse it.
   - **Body:** a one-line summary; **key claims, each with a citation**; a **`relates-to`** list of *candidate* cross-links phrased "connects to «X» because …" (the gardener resolves these into real edges); and an **`observed-tensions`** list — contradictions the agent noticed but was told **not to resolve**.
5. **Stance guardrail.** Flag contradictions, don't smooth them. Don't editorialize toward a synthesis or a conclusion. You are feeding a dialectic, not writing a report — a premature conclusion here would pre-empt the monks and the negation.
6. **Decorrelation.** If spawned in parallel with sibling research agents, you are **blind to them**. Research targets can be split per-pole or per-domain (matching the Phase 1d research split) so the drafts don't correlate.

## Copy-paste skeleton

The orchestrator instantiates one of these per research subagent, filling the bracketed fields:

```
You are a research subagent for a dialectic. Do TARGETED research and write
page-shaped drafts to the staging directory. Do NOT write a prose report and do
NOT return page content — return ONLY the file paths you wrote.

TARGET: [specific search directive — the exact argument/evidence/angle to find]
GAP TAG: [the open question this closes, verbatim — stamp it on every page]
STAGING DIR: [<dialectic-dir>/staging/]

For each distinct concept or source you find, write one draft file to the staging
dir in this format:

---
title: [page title]
type: concept | source
provenance: [you + round + where the gap came from]
gap: [verbatim gap tag]
date: [date]
---
[one-line summary]

## Key claims
- [claim] — [citation]
- ...

## relates-to
- connects to «[other page/idea]» because [reason]

## observed-tensions
- [contradiction you noticed — DO NOT resolve it]

STANCE: Flag contradictions, don't smooth them. Do not editorialize toward a
synthesis or conclusion — you are feeding a dialectic, not writing a report.

RETURN: only the list of file paths you wrote to the staging dir.
```
