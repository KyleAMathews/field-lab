# Survey Log Template

Create this only when the inquiry needs systematic memory, comparison, coordination, search, or audit. Distill the session so far; do not replay it.

Use a descriptive path in an existing `dialectic/` or `dialectics/` directory when present. Otherwise ask for or choose a narrow local path such as `survey-<topic>/survey_log.md`. Do not create a full Expedition directory tree yet.

```markdown
---
type: survey-log
title: <short inquiry title>
created: <YYYY-MM-DD>
state: survey
session-provenance: <task/thread pointer and useful turn span, if available>
---

# <Inquiry title>

## Original question

<Verbatim or clearly marked close paraphrase of how the inquiry entered the session.>

## Goal

<What the user is trying to understand, decide, make, or discuss.>

## Promotion trigger

<Why the session record alone is no longer enough.>

## Instruments already used

| Instrument | Authorization | Execution seat | Context boundary | Session pointer       | Access delta                               | Bounded reading | Artifact risk |
| ---------- | ------------- | -------------- | ---------------- | --------------------- | ------------------------------------------ | --------------- | ------------- |
| `<id>`     | <user pointer> | <actual seat>  | <who saw what>   | <turn or short quote> | <what became newly observable or testable> | <reading>       | <risk>        |

Include only probes that actually ran. Do not rewrite ordinary conversation as a formal instrument run.

## Key readings

| Reading | Kind                                                                                                                                                          | Support               | Confidence                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------- |
| <value> | <observation / measurement / user-testimony / source-claim / elicited-response / generated-sample / controlled-comparison / inference / analogy / hypothesis> | <pointer or citation> | <solid / plausible / reach> |

## Loaded terms

- **<term>:** <live meanings and who uses them>

## Current tensions

- <smallest live contradiction, with conditions and evidence status>

## Open gaps and coverage plan

| Gap   | Requested measurement | Offered instrument or source | Selection state          | Done when            |
| ----- | --------------------- | ---------------------------- | ------------------------ | -------------------- |
| <gap> | <what remains unseen> | `<instrument-id>`            | <offered / user-selected> | <coverage condition> |

## Current working question

<Where the Walk has arrived. Distinguish this from the original question.>

## Readout ledger

Append systematic readings here using the common contract from `reference/instrument-contract.md`.

## User orientation notes and choices

- **What the user noticed in the readings:** <verbatim or close paraphrase>
- **Selected next instrument or apparatus:** <selection and pointer, if any>
- **Explicit engine transition:** <conclude / synthesize / recommend / decide / plan / act, with pointer, or none>
```

## Integrity rules

- Preserve the original question and current working question separately.
- Mark the promotion trigger plainly; “this is important” is not enough.
- Keep claim kinds and support visible.
- Record the actual execution seat, context boundary, and any fallback downgrade for each systematic reading.
- Record authorization for every run. An offered instrument is not an instrument already used.
- Keep raw instrument readings separate from later analysis or synthesis.
- State when a reading came from ordinary chat rather than a formal probe.
- Ask only for gaps. Never make the user repeat material already present.
- Update the log as a working map, not as a transcript.
