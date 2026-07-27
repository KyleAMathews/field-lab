---
id: formation-section
name: "Formation section"
summary: "Source units, direct ordering relations, branches, overwrites, formation processes, and uncertain phases"
use_when: "An artifact, belief, project, or dispute accumulated through additions, deletions, reuse, and branching"
avoid_when: "Do not use when the material is one event sequence or lacks recoverable units and relations."
access_target: "How accumulated material formed without forcing it into one smooth timeline"
requires: "Versioned or accumulated material with source-linked units and some direct relations"
execution_seat: orchestrator
fresh_context: optional
effort: high
persistence: "A bounded corpus and relation register; use a Field Log when sources or revisions must remain traceable."
artifact_risk: "A partial order becomes false chronology, layers imply progress, or inferred phases replace source units."
maturity: draft
documented_uses: 0
---

# Formation section (`formation-section`)

- **Phenomenon sought:** How an accumulated artifact, belief, project, or dispute formed through additions, cuts, overwrites, reuse, and branches whose order may be only partly known.
- **Why use it:** A current state hides discarded work, residual parts, maintenance, and unrelated branches. A simple timeline forces all units into one order. A formation section preserves units and direct relations before proposing phases.
- **Operating range:** Use with drafts, commits, notes, records, oral history, or other accumulated material that supports recoverable units and relations. Do not use for one bounded event sequence, a polished artifact with no trace of formation, or a story whose “layers” are only a metaphor.
- **Input:** Freeze one bounded corpus. Each unit needs an identifier, content or description, and a source pointer. Relations may include earlier than, later than, cuts, overwrites, contains, reuses, or no established order.
- **What changes:** The operation decomposes the current whole into units and projects their direct relations as a partial order. It can expose hidden work but may also invent clean layers or progress.
- **Procedure:**
  1. **Freeze the corpus.** State what is included, excluded, and missing.
  2. **Register units.** Give each source unit a stable ID and record its content, source, and survival state: present, removed, overwritten, reused, or uncertain.
  3. **Record direct relations only.** Add earlier/later, cut, overwrite, containment, reuse, and branch relations supported by the sources. Leave unrelated units unordered.
  4. **Check the relation graph.** Flag cycles, contradictions, and relations inferred only from current position. Do not convert horizontal placement into time.
  5. **Name formation processes.** Describe additions, deletions, reuse, compression, maintenance, and residual survival that the direct relations support.
  6. **Propose phases separately.** Group units into one or more candidate phases only when useful. Mark the rule for each grouping, preserve alternative groupings, and never replace the unit register with the phase story.
  7. **Render the section.** Return a readable cross-section or partial-order diagram beside the unit and relation registers. Show gaps and branches.
  8. **Run reconstruction.** Check that the registered operations can produce the current artifact without erasing surviving units or inventing order.
- **Result:** Return the frozen corpus, unit register, direct relation register, branches, contradictions, formation processes, candidate phases, visual section, reconstruction result, missing sources, and unresolved order.
- **Control:** Source pointers and direct relations are the baseline. The graph check catches impossible order; reconstruction checks whether the account can produce the current state. Keep phase inference beside, never instead of, the unit register.
- **Common distortions:** Units are chosen to fit a story; later means better; adjacency becomes chronology; deletion becomes absence of influence; hidden work is romanticized; or a clean phase scheme overwrites branches and uncertainty.
- **Escalate / stop:** Stop when the corpus cannot support distinct units or direct relations. A causal, value, or decision claim requires another chosen operation.
- **What it requires:** Source extraction, relation checking, and a readable rendering. Use a Field Log when the corpus, corrections, and diagram need to persist.
- **Execution placement:** **Orchestrator.** One executor must hold the frozen corpus, unit IDs, relation register, and reconstruction control together. A fresh agent may audit a bounded relation graph, but it may not infer missing order from a summary.
- **Distinctness:** Unlike [`substrate-map`](substrate-map.md), this instrument represents accumulation and partial order rather than one event sequence. Unlike [`atlas`](atlas.md), it seeks formation processes rather than session memory and navigation. Unlike [`design-grammar`](design-grammar.md), it reconstructs how one state formed rather than the language of adjacent possible forms.
- **Provenance:** The operation adapts archaeological single-context recording, stratigraphic relations, Harris matrices, and formation-process analysis to source-traceable human artifacts. See [Historic England's Archaeological Recording Manual](https://historicengland.org.uk/content/docs/research/historic-england-archaeological-recording-manual-2018/). The transfer beyond archaeology remains a Field Lab hypothesis.
