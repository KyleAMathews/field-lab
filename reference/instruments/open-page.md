---
id: open-page
name: "Open page"
summary: "An uninterrupted, source-preserved account in the person's own order and language"
use_when: "Repeated analytic questions would constrain what a person can express"
avoid_when: "Do not use when the user wants a quick answer, cannot choose a safe prompt, or expects automatic analysis."
access_target: "Material expressed when the user controls sequence, emphasis, vocabulary, and length"
requires: "One bounded prompt and a user who chooses to write or speak freely"
execution_seat: orchestrator
fresh_context: none
effort: low
persistence: "One uninterrupted response and one correction exchange; can be done here."
artifact_risk: "The prompt steers the account, more text is mistaken for more truth, or the model analyzes without consent."
maturity: draft
documented_uses: 0
---

# Open page (`open-page`)

- **Phenomenon sought:** What a person expresses when they control the order, emphasis, vocabulary, and length of one account without an interviewer choosing each next topic.
- **Why use it:** Repeated questions can narrow recall, add the interviewer's categories, and tire someone who thinks more naturally through writing or uninterrupted speech. One open prompt can preserve the person's own path through the material.
- **Operating range:** Use when the user wants to describe, remember, or explore one bounded situation in their own way. Do not use when they want a quick answer, when no prompt feels safe enough, or when they expect the model to analyze the response automatically. This is an articulation method, not treatment; health claims from expressive-writing research do not transfer to this card.
- **Input:** Agree on one short prompt and whether the user will write, dictate, or send several messages. State that the model will wait and will not analyze until asked.
- **What changes:** The prompt still directs attention, but the user controls the response after it begins. The lack of interruption may reveal material that a question sequence would not invite; it may also produce only more text.
- **Procedure:**
  1. Turn the user's aim into one bounded, non-leading prompt. Prefer “Write what feels important about…” over a list of subquestions.
  2. Tell the user to use their own order and length, and to mark completion with a word such as `done` if they plan to send several messages.
  3. Do not interrupt, summarize, interpret, reassure, or ask follow-ups while the page is open. Acknowledge only when needed to keep the channel open.
  4. Preserve the response as the source account. Do not silently clean up, reorder, or convert its wording into categories.
  5. When the user closes the page, ask one source-check question: “Is there anything you want to add or correct before I work with this?” Stop after recording the answer.
- **Result:** Return or retain the prompt, the source account, and any correction. During a formal trial, record whether the user would choose this mode again for similar material. Do not claim that unprompted order is unbiased or that length marks importance.
- **Control:** Keep the exact prompt with the account. Separate the raw response from any later extraction or transformation. During a formal trial, ask whether this mode fit only after the source correction is complete, in a later turn. Compare it with ordinary questioning only if the user chooses that added work.
- **Common distortions:** A broad prompt hides several demands; the model treats silence as permission to intervene; fluent prose looks more certain than it is; the correction question becomes an analysis menu; or an expressive-writing donor claim is mistaken for evidence about this LLM port.
- **Escalate / stop:** Stop when the user closes the page, asks for interaction, or no longer wants to continue. Any summary, analysis, or other instrument needs a new request or prior selection.
- **What it requires:** One prompt, uninterrupted user time, and one correction exchange. The model does less during collection; the user chooses the length.
- **Execution placement:** **Orchestrator.** The key control is live noninterruption and preservation of the user's sequence. If the interface cannot receive an uninterrupted account, let the user send chunks and wait for their completion marker.
- **Distinctness:** Unlike [`elenchus`](elenchus.md), Open Page gives the user control of the path instead of using questions to expose assumptions. Unlike [`behavior-chain`](behavior-chain.md), it collects an account without assigning its material to a functional sequence.
- **Provenance:** The card combines freewriting and uninterrupted-response practices with cognitive-interviewing controls against interviewer imposition. It makes no treatment claim. See the [U.S. Census cognitive-interviewing standard](https://www.census.gov/about/policies/quality/standards/appendixa2.html) and [CDC cognitive interviewing guidance](https://www.cdc.gov/nchs/ccqder/question-evaluation/cognitive-interviewing.html).
