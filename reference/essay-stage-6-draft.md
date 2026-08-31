# Essay Stage 6: Draft and Validate

```yaml
id: essay-draft
aim: Transform the frozen evidence and approved design into prose under the general writing guide and any selected writer-voice profile, then test close-reading value, reader response, and semantic drift before user approval.
requires: One explicitly approved design, frozen source ledger, the general writing guide, either no external profile or one explicit profile pointer, and a draft research boundary.
scheduled-instruments:
  required: [source-bound-drafting, meso-density-assay, reader-assay, semantic-drift]
  conditional: [blind-cartography when public packaging or introduction changed materially, outcome-ablation for a named transfer recall or structural claim, framing-sensitivity when wording order or model may change a decision]
order-rationale: Draft from frozen evidence before testing; preserve a pre-edit snapshot; run blind draft prediction before cleanup can anchor it; compare edits with the snapshot after bounded cleanup; test close-reading value before reader-intent results can frame that comparison.
operations: Resolve the frozen writer-voice selection; run source-bound drafting; preserve its draft and snapshot files; run no more than three bounded cleanup passes under the general guide and selected profile; record substantive edit decisions.
outputs: Draft files, applied writing constraints, source trace, draft-generated question register, meso-density reading, reader readings, semantic comparison, optional controls, and user approval or a selected return.
return-point: The user receives the draft, validation results, unresolved gaps, and risky changes before approval or publication.
completion-gate: Every load-bearing claim traces to source or its gap has been verified, narrowed, removed, or framed as explicit uncertainty in the essay; unresolved markers block approval; the applied writing constraints and profile provenance are recorded; new theory is excluded or returned; required tests completed; every relevant conditional control is selected or declined; user has read and explicitly approved the final draft or chosen another branch.
branches: [run-draft-cartography, run-outcome-ablation, run-framing-sensitivity, revise-draft, return-to-design, return-to-validation, return-for-theory, approve-draft, stop]
```

## Drafting and validation order

Read the [general writing guide](writing-guide.md) before drafting. Resolve the
frozen selection through the
[external writer-voice profile contract](writer-voice-profiles.md). If a profile
was selected, read that exact version and translate it into a short constraint
set for this essay. If it is missing or unreadable, report the fallback and use
the general guide alone. Do not infer or search for another profile.

Run [`source-bound-drafting`](instruments/source-bound-drafting.md) with the
frozen inputs. Preserve its draft, pre-edit snapshot, source trace, and question
register under `drafts/`. Record the general guide, profile pointer or `none`,
profile version when available, and applied constraints with the draft. When
title, subtitle, or introduction changed
materially, offer a draft-prediction checkpoint through
[`blind-cartography`](instruments/blind-cartography.md). Record
`workflow.paused` and wait. If selected, record `workflow.resumed`, run the
checkpoint before cleanup, return its bounded expectedness reading, and rejoin
Stage 6 at cleanup. If declined, preserve the waiver and unmeasured collapse
risk.

Run no more than three cleanup passes in the order declared by the general
writing guide. Check the selected profile during the fidelity pass. Preserve
meaning and record every change beyond mechanics. Any new substantive choice
returns to the instrument or stage that owns it; a cleanup pass may not add
theory, evidence, examples, or argumentative links.

Then run
[`meso-density-assay`](instruments/meso-density-assay.md),
[`reader-assay`](instruments/reader-assay.md), and
[`semantic-drift`](instruments/semantic-drift.md). Keep the density readers
blind to the intended reader promise and author account of value. Offer
[`outcome-ablation`](instruments/outcome-ablation.md) or
[`framing-sensitivity`](instruments/framing-sensitivity.md) only when their
calling conditions appear. Name the trigger, input, added work, and likely
distortion; record `workflow.paused`; and wait for selection. Record
`workflow.resumed` before a selected run, return its bounded reading without
choosing an edit, and rejoin the Stage 6 gate. A decline preserves the named
outcome or sensitivity as unmeasured.

## Gate and return

Return the draft path and length, applied writing constraints, profile
provenance or `none`, source gaps, meso-density reading, reader readings,
semantic changes, frame distortions, unresolved misfits, and return questions.
Present risky voice or meaning changes for approval rather than applying them
silently.

Before offering `approve-draft`, resolve every load-bearing unsupported marker.
For each one, record exactly one disposition:

- **verified** within the authorized research boundary, with its new source and
  claim kind;
- **narrowed** to the supported scope, with the before-and-after claim;
- **removed**, with the affected passage and transition checked; or
- **uncertainty framed** in the essay so the reader can see what is unknown and
  the prose does not imply support.

A working-note marker, footnote placeholder, vague hedge, or entry in the
question register does not satisfy this gate. Any unresolved load-bearing gap
requires `revise-draft`, `return-to-validation`, `return-for-theory`, or `stop`.

Pause until the user reads the draft. Revision reruns only affected tests. After
explicit approval, confirm filename and frontmatter, remove working notes from
the published artifact, record `workflow.completed`, and leave publication or
sharing to a later explicit request.
