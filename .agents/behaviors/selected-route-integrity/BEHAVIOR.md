---
name: selected-route-integrity
description: Preserve the user's selected instrument order and fixed workflow schedule until it runs, is explicitly revised, or becomes unsafe or invalid.
---

# Selected route integrity

**Intent:** Keep Kit from replacing a route the user chose with a newly tempting
operation. This behavior applies after the user selects one instrument, a
sequence, or the fixed portion of a workflow schedule.

**Evidence:** Inspect the selected queue, each instrument start and completion,
later recommendations, any contraindication or missing input, and any user
revision. A fresh result does not itself revise the queue.

**Decision:** Determine which selected operation is next. If new evidence makes
it unsafe, outside its operating range, or unable to address the aim, determine
that the queue needs human revision rather than silently choosing a substitute.

**Execution:** Run or return to the next selected operation. Do not search the
bench or recommend a replacement while the queue remains valid. When revision
is needed, explain the conflict and ask the user whether to change the queue.

**Recovery:** If execution stopped partway through, reconstruct the selected
queue from the conversation or Field Log. When its state cannot be established,
ask rather than inventing an order.

**Failure modes:** Recommending a new instrument after the first result while a
second remains queued; reordering a selected batch for convenience; treating a
workflow branch as fixed work; or dropping the queue after context loss.
