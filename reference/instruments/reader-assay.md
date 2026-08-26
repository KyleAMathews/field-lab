---
id: reader-assay
name: "Reader Assay"
summary: "Fresh-reader claims, confusion, memory, and usable change after encountering a draft"
use_when: "A draft needs a separated test of what readers actually recover rather than what the author intended"
avoid_when: "Do not treat model readers as a population sample or substitute them for a specialized human audience."
access_target: "Reader reconstruction, confusion, memorable particulars, usable delta, and genericity signals"
requires: "A frozen draft, target reader description, neutral questions, and separated readers"
execution_seat: parallel-subagents
fresh_context: required
effort: medium
persistence: "Several reader responses plus exact prompts; preserve with the tested draft version."
artifact_risk: "Prompted readers echo the intended answer, shared model lineage looks like consensus, or a profile becomes stereotype."
maturity: draft
documented_uses: 0
---

# Reader Assay (`reader-assay`)

- **Phenomenon sought:** What separated readers reconstruct, fail to understand, retain, and say they could newly distinguish or attempt after reading one frozen draft.
- **Why use it:** Authors and informed editors see intended structure. Fresh readers expose transmission failures and unintended readings.
- **Operating range:** Use on a complete draft or bounded section. Model readers yield generated response samples; human readers provide stronger audience evidence.
- **Input:** Frozen artifact version, target reader description grounded in the brief, neutral question set, and at least two separated readers; use three or more for a decision-bearing pattern.
- **What changes:** Readers encounter the draft without the author's thesis, validation history, expected answer, or sibling responses.

## Procedure

1. Freeze the exact draft and reader description. Remove intended-answer cues from the task prompt.
2. Give each reader the same artifact and ask: what it claims; where it confuses or fails to convince; what detail or distinction remains; what they can now notice, explain, decide, or attempt; and what feels generic or predictable.
3. Keep responses sibling-hidden and record reader type, context, model when known, and exact prompt.
4. Compare stable recoveries, disagreements, omissions, false reconstructions, and profile-sensitive responses.
5. Trace each response to the draft. Mark unsupported reader inference rather than treating it as text content.
6. Compare observed responses with the earlier `reader-promise` without scoring the essay or choosing revisions.

- **Result:** Individual responses, stable and divergent reconstructions, confusion points, memorable particulars, observed usable deltas, genericity signals, source locations, and audience limits.
- **Control:** Frozen draft, neutral prompt, separated readers, sibling blindness, and exact response trace. Report same-model correlation and sample limits.
- **Common distortions:** Leading questions manufacture success; model agreement becomes audience consensus; profiles encode stereotypes; or one articulate response outweighs others.
- **Escalate / stop:** Escalate to actual target readers when publication stakes or domain expertise matter. Offer `framing-sensitivity` when wording or order appears causal. Stop when the selected sample and limitations are recorded.
- **What it requires:** Two to five fresh contexts or external readers. More samples do not create statistical calibration.
- **Execution placement:** **Parallel subagents required for an agent assay.** Each sees only the frozen draft, reader setting, and neutral questions. The orchestrator collates without rewriting or deciding. Without fresh contexts, return an author self-check under another name.
