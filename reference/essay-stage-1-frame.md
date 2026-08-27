# Essay Stage 1: Frame the Search

```yaml
id: essay-frame
aim: Confirm the editorial use, source boundary, map-review and validation policies, and research limits without deciding the essay.
requires: A new Essay Field Log and at least one registered source Field Log.
scheduled-instruments:
  required: [focus-interview]
  conditional: []
order-rationale: Read the source Field Logs before the interview so the framing questions fit the actual inquiry; freeze the brief before editorial interpretation, candidate generation, research, or presentation.
operations: Validate and read the source Field Logs as the interview specimen; record exact source paths and initial-read coverage; create the workflow plan and artifact directories.
outputs: A frozen editorial brief, source inventory and initial-read coverage, map-review and validation policies, research boundary, and Stage 2 opening choice.
return-point: The user sees the complete brief and source boundary before source interpretation begins.
completion-gate: Every brief field is confirmed or explicitly unknown; source logs validate and their Field Log entries have received an initial full pass; no candidate or editorial source interpretation has been generated.
branches: [revise-brief, start-survey, stop]
```

## Local procedure

After the user starts Stage 1, validate and inspect each registered source Field
Log, then read its Field Log entries in full as the Focus Interview specimen.
Include the user's editorial request and framing in that specimen. Record exact
paths, entry ranges, missing or unreadable regions, and linked artifacts not yet
opened. Keep the pass read-only and orienting: do not extract editorial signals,
compare candidates, rank material, or draft an interpretation.

Run [`focus-interview`](instruments/focus-interview.md) after that initial pass
and only for missing fields. The Stage 1 specimen is the editorial request plus
the registered source Field Logs, not merely their metadata. Confirm:

- which Field Logs and source regions are in scope;
- why an essay may matter now;
- possible readers or conversations, including `unknown`;
- what the reader should be able to see, feel, understand, compare, question, or do afterward, stated without choosing a structure;
- one essay, a possible portfolio, an open map, or another bounded output;
- whether a useful explainer may count or a fresh contribution is required;
- whether the default Stage 3 return should show a compact sketch of every
  candidate before the user chooses a validation set;
- how completed, null, not-applicable, missing, and conflicting gate readings map
  to candidate states;
- research topics, sources, deadline, and effort boundaries; and
- claims or subjects the user does not want to pursue.

Offer the recommended map-review policy from
[essay-workflow.md](essay-workflow.md) and its recommended validation policy as
visible defaults. Ask only whether the user wants to change them; do not make
the user invent an abstract candidate cap before seeing the map. Record the
user's exact corrections. Do not ask what essay they want; that is a later
result.

Create `probes/` and `drafts/` only as ordinary artifact directories. Do not
create an editorial map or essay log.

## Gate and return

Return the editorial brief, reader goal, registered source Field Logs,
map-review and validation policies, initial-read coverage, research boundary, known
constraints, and missing fields. Make clear that Stage 2 will re-examine the
frozen corpus systematically and type every editorial signal; the orienting
pass does not count as that survey. Record the completed Focus reading and pause
the workflow. The user chooses whether to revise, start Stage 2, or stop.
