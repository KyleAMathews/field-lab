---
id: loss-audit
name: "Hidden-signal recovery assay"
summary: "Recovered items and the rule that dropped them"
use_when: "Comparison may erase useful single-source material"
avoid_when: "Do not run without source-level outputs and a frozen reduction whose omissions can be traced."
access_target: "Recovered items and the rule that dropped them"
requires: "source outputs plus a proposed reduction or candidate"
execution_seat: parallel-subagents
fresh_context: preferred
effort: medium
persistence: "One pass per source; preserve with the comparison it audits."
artifact_risk: "“Interesting” substitutes for supported and useful; every dropped item is rescued."
maturity: established
documented_uses: 27
---

# Hidden-signal recovery assay (`loss-audit`)

- **Phenomenon / range / input:** Useful supported material carried by only one source and dropped by comparison; needs source outputs plus a proposed reduction or candidate.
- **Why use it:** Combined summaries favor shared material. Independent re-scans expose high-value single-source items and the rule that dropped them.
- **Perturbation / procedure:** Freeze the proposed summary, comparison, decomposition, or candidate. Re-scan each source separately, with sibling sources hidden when possible. List supported items absent from the frozen result, then trace where each vanished: compression, majority agreement, category mismatch, low salience, or explicit rejection. Preserve support and source pointers before collating the lists.
- **Readout / control:** Recovered item, original support, where it vanished, and the comparison rule that dropped it. Do not judge usefulness or decide whether to restore it.
- **Common artifacts:** “Interesting” substitutes for supported and useful; every dropped item is rescued.
- **Escalate / stop:** Offer a separate evaluation only when the user wants recovered items judged. Stop after every source has a recovered/dropped trace.
- **What it requires:** One pass per source; keep it with the comparison it audits.
- **Execution placement:** **Parallel subagents preferred.** Give each fresh scanner one source and the proposed reduction, with provenance labels and sibling sources hidden; the orchestrator collates recovered items without judging them. Isolation protects single-source material from consensus compression. If agents are unavailable, the orchestrator re-scans one source at a time with provenance stripped and labels the result lower-confidence.
