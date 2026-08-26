# Essay Stage 6: Draft and Validate

```yaml
id: essay-draft
aim: Transform the frozen evidence and approved design into prose, then test reader response and semantic drift before user approval.
requires: One explicitly approved design, frozen source ledger, selected voice constraints, and a draft research boundary.
scheduled-instruments:
  required: [source-bound-drafting, reader-assay, semantic-drift]
  conditional: [blind-cartography when public packaging or introduction changed materially, outcome-ablation for a named density transfer recall or structural claim, framing-sensitivity when wording order or model may change a decision]
order-rationale: Draft from frozen evidence before testing; preserve a pre-edit snapshot; run blind draft prediction before cleanup can anchor it; compare edits with the snapshot after bounded cleanup.
operations: Run source-bound drafting; preserve its draft and snapshot files; run no more than three mechanical cleanup passes; record substantive edit decisions.
outputs: Draft files, source trace, draft-generated question register, reader readings, semantic comparison, optional controls, and user approval or a selected return.
return-point: The user receives the draft, validation results, unresolved gaps, and risky changes before approval or publication.
completion-gate: Every load-bearing claim traces to source or its gap has been verified, narrowed, removed, or framed as explicit uncertainty in the essay; unresolved markers block approval; new theory is excluded or returned; required tests completed; every relevant conditional control is selected or declined; user has read and explicitly approved the final draft or chosen another branch.
branches: [run-draft-cartography, run-outcome-ablation, run-framing-sensitivity, revise-draft, return-to-design, return-to-validation, return-for-theory, approve-draft, stop]
```

## Drafting and validation order

Run [`source-bound-drafting`](instruments/source-bound-drafting.md) with the
frozen inputs. Preserve its draft, pre-edit snapshot, source trace, and question
register under `drafts/`. When title, subtitle, or introduction changed
materially, offer a draft-prediction checkpoint through
[`blind-cartography`](instruments/blind-cartography.md). Record
`workflow.paused` and wait. If selected, record `workflow.resumed`, run the
checkpoint before cleanup, return its bounded expectedness reading, and rejoin
Stage 6 at cleanup. If declined, preserve the waiver and unmeasured collapse
risk.

Run no more than three mechanical passes for prose mechanics, unsupported
claims, citations, stale phrasing, and repetition. Preserve meaning and record
every change beyond mechanics. Any new substantive choice returns to the
instrument or stage that owns it; a cleanup pass may not add theory, evidence,
examples, or argumentative links.

Then run [`reader-assay`](instruments/reader-assay.md) and
[`semantic-drift`](instruments/semantic-drift.md). Offer
[`outcome-ablation`](instruments/outcome-ablation.md) or
[`framing-sensitivity`](instruments/framing-sensitivity.md) only when their
calling conditions appear. Name the trigger, input, added work, and likely
distortion; record `workflow.paused`; and wait for selection. Record
`workflow.resumed` before a selected run, return its bounded reading without
choosing an edit, and rejoin the Stage 6 gate. A decline preserves the named
outcome or sensitivity as unmeasured.

## Gate and return

Return the draft path and length, source gaps, reader readings, semantic changes,
frame distortions, unresolved misfits, and return questions. Present risky voice
or meaning changes for approval rather than applying them silently.

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
