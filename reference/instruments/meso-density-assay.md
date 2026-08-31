---
id: meso-density-assay
name: "Meso-Level Density Assay"
summary: "What close reading of a full draft preserves beyond an accurate short summary"
use_when: "A complete draft should reward close reading through mechanisms, sequences, evidence, particulars, or connections"
avoid_when: "Do not treat omitted detail by itself as value or use the assay to demand needless length."
access_target: "The valuable, text-supported loss between a short reconstruction and close reading"
requires: "A frozen complete draft, one summary reader, one close reader, neutral prompts, and exact text trace"
execution_seat: parallel-subagents
fresh_context: required
effort: medium
persistence: "One summary, one close-reading delta, and a verification ledger per draft version."
artifact_risk: "Readers praise detail in the abstract, confuse length with density, or echo a supplied account of the essay's value."
maturity: draft
documented_uses: 0
---

# Meso-Level Density Assay (`meso-density-assay`)

- **Phenomenon sought:** What a careful encounter with the full draft makes
  available that an accurate short reconstruction cannot carry.
- **Why use it:** An essay may communicate its headline while losing the
  mechanisms, sequences, evidence, particulars, tensions, and connections that
  make close reading worthwhile. Ordinary summary checks do not expose that
  middle layer.
- **Operating range:** Use on a complete frozen draft or a substantial section.
  It tests recoverable close-reading value, not length, literary merit, novelty,
  or whether the essay should exist.
- **Input:** Frozen draft version, one fresh summary reader, one separate fresh
  close reader, exact neutral prompts, and access to the text for verification.
- **What changes:** The first reading compresses the draft to 100 words. The
  second reading compares the full draft with that summary and identifies what
  the compression cannot preserve.

## Procedure

1. Freeze the exact draft. Do not give either reader the intended thesis,
   reader promise, validation history, or desired answer.
2. Give the full draft to one fresh reader and ask for an accurate 100-word
   summary. Preserve the exact response.
3. Give the full draft and that summary to a separate fresh reader. Ask what a
   close reading provides that the summary cannot, and where the text provides
   it.
4. Keep the second reader blind to the author's own account of the essay's
   value and to any preferred verdict.
5. Verify every claimed loss against the draft. Classify text-supported losses
   as mechanism, sequence, evidence, particular, tension, cross-section
   connection, felt texture, or another named function.
6. Separate valuable loss, mere extra detail, unsupported reader inference,
   and material the summary should have retained.
7. Return the comparison without scoring the essay or choosing revisions.

- **Result:** Draft pointer, summary, close-reading delta, verified text
  locations, loss classifications, unsupported reader inferences, reader
  disagreements, and sensitivity limits.
- **Control:** Frozen draft, fixed summary length, neutral prompts, separate
  fresh contexts, and claim-by-claim verification against the text. Fresh model
  contexts remain correlated and do not represent a reader population.
- **Common distortions:** The summary reader writes a bad summary; the close
  reader rewards sheer quantity; vague praise replaces text locations; ornate
  phrasing is mistaken for felt texture; or author intent enters the prompts.
- **Escalate / stop:** Repeat with a human target reader when the audience or
  publication stakes require it. Return to design when the verified delta lacks
  work assigned by the approved design. Stop after the selected draft version
  has one legible comparison and its limits are recorded.
- **What it requires:** Two separated fresh contexts or external readers, the
  frozen draft, exact prompts, and an orchestrator verification pass.
- **Execution placement:** **Parallel subagents required for an agent assay.**
  The summary reader sees only the draft and summary prompt. The close reader
  sees only the draft, the produced summary, and the comparison prompt. The
  orchestrator verifies cited losses and returns the bounded reading. Without
  separated readers, downgrade to an author compression check and do not call
  it this assay.
