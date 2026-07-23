# Phase 4 — Stage B: Lateral Creativity Interventions (4.5)

**Before starting:** Confirm that the prior phase or stage passed the [workflow completion gate](dialectic-workflow.md#completion-gate). If not, stop and run it.

_This stage builds the "sea of anarchy" you will shatter in Stage C: compressed conflicts, a multi-domain donor pool recruited blind, and a non-propositional pause. Do this BEFORE the Boydian decomposition so the new material becomes atomic parts in the decomposition rather than an afterthought._

## Stage B instruments

Announce `defamiliarize` before compressed conflicts and the non-propositional pause. Announce `donor-perturb` before writing blind recruitment briefs. Preserve its hybrid execution: a fresh blind recruiter selects distant fields; isolated researchers study donors on their own terms; the sighted orchestrator may only veto home-adjacent picks and later test transfers. Do not let the random-donor tool or research agents stand in for the instrument's source isolation and negative controls.

## 4.5 Lateral Creativity Interventions

Lateral interventions surface vocabulary and structural frames that within-domain analysis cannot produce. In later rounds the value compounds — the synthesis is pushing past its own limits and the vocabulary is running out — but the cross-domain material is high-leverage from the start.

The dialectic processes everything through propositional structural analysis. That channel is powerful but it can only recombine existing conceptual vocabulary — it cannot generate _new_ vocabulary. The following interventions force the mind to process the problem through channels it wasn't using.

**These interventions come BEFORE the Boydian decomposition** so that the new material they produce becomes atomic parts in the decomposition. Running decomposition first means you shatter and recombine within the same conceptual space, then bolt on random domains as an afterthought. Running lateral interventions first means the random domains get decomposed and cross-connected alongside the monks' material — producing genuinely new combinations.

### 4.5a Compressed Conflict Generation

Express each core tension from the determinate negation (4.3) as a **two-word oxymoron** — a "compressed conflict" (from Gordon's Synectics). Examples: "productive dissipation," "autonomous dependence," "structured spontaneity," "durable ephemerality."

Generate 5-7 compressed conflicts. Select the 2-3 most resonant ones to guide synthesis direction.

**Why this works:** The oxymoron format holds the contradiction as a _unit_ rather than resolving it. It encodes the tension in a form that resists premature resolution — exactly what you want before synthesis.

### 4.5b Donor Recruitment for the Sea of Anarchy

Boyd's snowmobile is built from four shattered domains (skis, outboard motor, handlebars, treads), each chosen for the _operation_ it contributes. Two monk-positions plus one skimmed article is too thin a sea. This step **recruits donor domains** that get decomposed alongside the monks in 4.6 at equal depth — not garnished on afterward. Recruit from two streams:

**Random donors (novelty / anti-habit).** The orchestrator picking a "random" domain filters through its own conceptual habits. Wikipedia's randomness is genuinely external. **Use curl (via bash)** — WebFetch/fetch tools return 403 on Wikipedia:

```bash
curl -s "https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=50&format=json"
```

To get extracts for promising ones:

```bash
curl -s "https://en.wikipedia.org/w/api.php?action=query&titles=ARTICLE_TITLE&prop=extracts&exintro=true&explaintext=true&format=json"
```

Scan titles, fetch extracts for the ones maximally distant from the dialectic's domain with enough conceptual density (not stubs). Typically 5–8 of 50 have substance.

**Functional donors (operation-targeted, recruited _blind_).** The trap: if you pick these yourself you know the home domain, so you reach for its nearest neighbors — a strategy problem pulls "central-bank independence" and "TCP/IP," which are adjacent fields in a costume, not cross-domain injections. Relevance without distance is recombination, not creation. Defeat the bias by recruiting blind:

1. **Write a domain-neutral structural brief.** **What becomes a brief:** one brief per determinate-negation "missing thing" (4.3) — these are mandatory, the floor. You _may_ add briefs for hidden questions (4.4), cross-cutting tensions, or compressed conflicts when they open a genuinely different domain — more relevant domains make a richer snowmobile. **Label each brief with its source** (`negation-A`, `negation-B`, `hidden-Q`, …); the recruiter's selection rules in step 3 read these labels. **Also tag each brief's epistemological register** — the _mode of knowing_ the missing thing lives in: `mechanistic/causal`, `interpretive/hermeneutic`, `normative/evaluative`, `relational/recognitional`, or `experiential/embodied`. This tag is load-bearing: stripping home-domain nouns _also_ strips the register, flattening (say) a claim about trust-recognition or fidelity into a bare optimization shape — which analytical donors then match beautifully, so the recruiter, faithfully matching structure, returns an all-analytical sea. The register tag tells the recruiter which _mode_ to match, not just which structure. (Register is far more abstract than the home domain — `relational/recognitional` is shared by gift exchange, mentorship, diplomacy, jazz — so it leaks little, and step 3's leak check still catches what it does.) Render each as an abstract _relational pattern_ with **every home-domain noun stripped** — no industry, company, product, or technology words. E.g. "a mechanism by which a part keeps its function after being absorbed into a larger whole whose survival does not depend on that part" — _not_ "how an acquired team keeps its mandate." Strip out acronyms, named standards, and single-field terms of art too (`MUST/SHOULD/MAY` names the home domain as loudly as a product name). You are the leaker and **cannot see your own leak** (curse of knowledge), so don't rely on re-reading your own brief — the real leak check runs at step 3, where the blind recruiter reports the domain it infers. A leaked brief re-infects the recruiter with your bias.
2. **The field palette — the recruiter fetches it, you don't hand-curate it.** A hand-written menu is partial and carries the orchestrator's bias (the exact thing we're fighting). Use Wikipedia's _Outline of academic disciplines_ as an authoritative, comprehensive taxonomy. Academic disciplines are the right register on two counts: they stay broad (the outline spans the whole map of knowledge), and they _formalize and document_ their key abstractions — so the concepts arrive pre-articulated in transferable form, which is exactly what the step-5 research pass needs to extract and shatter. **The recruiter reads the page itself — you do not pre-digest it.** Put the fetch command below in the recruiter's prompt and let it read the _full_ result. Do NOT fetch the outline yourself and paste in a summarized menu: any condensing re-curates the list through your bias (e.g. collapsing the entire Life science branch to "Biology"), which is exactly the failure this step exists to prevent — and it hides the breadth the recruiter is meant to choose against (the ≤1-life-science cap is meaningless if the recruiter never sees how deep the _other_ branches go). Fetch the complete wikitext, which includes every discipline _and_ its subdisciplines as nested list items, not just top-level headings:

   ```bash
   curl -s "https://en.wikipedia.org/w/api.php?action=parse&page=Outline_of_academic_disciplines&prop=wikitext&format=json"
   ```

   The disciplines are grouped under five top-level meta-domains: **Humanities** (1), **Social science** (2), **Natural science** (3, splitting into Physical science 3.1 and Life science 3.2), **Formal science** (4), **Applied science** (5). The recruiter ranges across as many of the five branches as possible. (The recruiter may also pull a few random Wikipedia articles — as in the random-donor stream — to surface fields the academic outline thins out, e.g. crafts and folk practices.)

3. **Dispatch the blind recruiter — it both generates candidates AND picks the final set** with ONLY the structural briefs + the step-2 fetch command so it reads the full Outline page itself (no problem, no home domain, no monk essays, no pre-summarized palette). Put these hard constraints in its prompt:
   - **Leak check FIRST, before recruiting:** name the single domain these briefs most smell like. If you can name a specific home field, or you spot any acronym, named standard, proper noun, or single-field term of art in a brief, say so and stop. — If the recruiter names your actual home domain (or flags a brief), the briefs are contaminated: re-strip the flagged brief and re-dispatch. This is the real leak gate; the orchestrator's own re-read (step 1) cannot catch its own curse-of-knowledge.
   - **Maximum meta-domain diversity is the PRIMARY objective** — not a tiebreaker applied after fit. Across all picks, span the widest possible range of the five branches.
   - **Span epistemological registers too — this is co-primary, not secondary.** Each brief carries a register tag (mechanistic / interpretive / normative / relational / experiential). Match donors _in the brief's own register_: a `relational/recognitional` pattern wants fields that inhabit relationship as a mode of knowing (care ethics, gift-exchange anthropology, mentorship traditions, diplomacy), NOT fields that model it from the outside (game theory, network sociology). A set that spans four academic branches but is entirely analytical/explanatory is a monoculture in the dimension that matters — academic-branch spread does not imply register spread (Philosophy _of Science_ is the Humanities branch yet maximally analytical).
   - **At most ONE pick from the Life science branch (3.2) and its children.** Biology/ecology/medicine read as the most mechanistically legible and are the lazy default — cap them at one across all patterns.
   - **Over-generate: 4 candidate domains per pattern,** each naming a _specific technical concept_ from that field plus one sentence on the structural match. No vague "law handles this" — name _adverse possession_, _ratio decidendi_, _littoral drift_, _Schenkerian reduction_.
   - **No two picks from the same broad field;** if a field repeats across patterns, flag it and offer a swap.

   Enforced ignorance: it never sees the home domain, so it pattern-matches structure, not nearest-neighbors.

   **Then the recruiter selects the final 3–5 itself — selection is blind on purpose.** Every selection criterion below is structural and needs no knowledge of the home problem, so the _blind_ recruiter applies them. This is the load-bearing change: the legibility bias kept re-entering wherever the _sighted_ orchestrator picked (it collapses the set onto whatever meta-domain or register reads as most legible and rich to it), so picking is moved to the party that has no home-domain knowledge to be biased by. The recruiter picks to satisfy ALL of these at once and outputs a `pattern → donor(s)` manifest, each donor tagged with meta-domain and register:
   - **Cover every negation first.** Each `negation-*` brief gets ≥1 donor _before_ any brief gets a second and _before_ any `hidden-Q` / cross-cutting brief gets any. Two donors for one negation and none for another silently re-arms one side of the dialectic and starves the other — the synthesis then leans to the well-donored side for reasons unrelated to the argument.
   - **`[prior-overlap]` cap.** A brief the orchestrator tagged `[prior-overlap]` gets **no more donors than each negation has** — the prior must assemble out of a sea stocked at least as well for the gaps, never recruit its own confirmation. (If the synthesis later lands on the pre-analysis guess, this manifest is the first suspect — the dislodgement test: rebalance and re-run.)
   - **Meta-domain spread: ≥3 distinct, never two from the same one** — living systems, physical, social/institutional, formal/mathematical, linguistic/cultural, artistic. A sea that is all one meta-domain inherits that domain's deep priors (e.g. biology's selection / fitness / organism-boundary) and its diversity is illusory.
   - **Register spread: cover each brief's register tag.** If every donor explains / models / optimizes — even across four meta-domains — the sea is analytically monocultured and dissolves any `relational/recognitional`, `normative`, or `experiential` claim into mechanism (the level-reduction failure: a claim about trust or fidelity comes back as an optimization problem). Each such brief needs ≥1 donor that inhabits its register on its own terms. **Meta-domain and register are independent axes — both must hold at once;** fixing one by collapsing the other is the same bias in a new costume. (This is the 4.6-step-5 epistemological-diversity check, promoted up to selection.)

4. **Distance veto (orchestrator) — the one sighted check, and it is negative only.** You know the home domain; the recruiter doesn't — so it cannot tell when a register-tightened brief led it to reconstruct the home field's own neighbors (a faith dialectic getting "pastoral theology / fiducial faith" back as a "donor" is zero distance — the home domain talking to itself; relevance without distance is recombination, not creation). Your **only** job here is to **veto** any finalized donor that IS the home field or its immediate neighbor and send it back for a blind replacement. Strictly negative: you may _remove_ a too-close pick, never _add_ one you find more resonant or _reorder_ for "fit." Selection lives with the blind recruiter precisely so your legibility habit — the pull toward whatever reads as most legible and rich to you — has no positive step to re-enter. **If you catch yourself improving the set rather than just vetoing home-adjacent picks, stop: that is the bias.**

   **The manifest is a commitment, not a shortlist.** Every surviving donor gets decomposed at equal depth (step 5). A vetoed donor is _replaced_ from the recruiter's pool (a blind re-pick), never silently dropped to shrink the sea toward what you already understand.

5. **Research each donor domain, then decompose at equal depth in 4.6.** For each finalized domain do a research pass — the recruiter can continue, or dispatch one researcher per domain in parallel — that surfaces the _field's own_ concepts, mechanisms, and technical vocabulary around the abstract pattern (for immunology: clonal selection, central vs. peripheral tolerance, immunosuppressant maintenance dosing — not a layperson sketch of "rejection"). Keep the researcher focused by the abstract pattern but **still blind to the home problem**, so the donor material is gathered on its own terms and gets shattered by you (who knows the problem), not pre-bent toward the answer — the same decorrelation that keeps the monks honest. The field's real vocabulary is where new synthesis vocabulary comes from; Boyd's whole point is that within-domain recombination cannot generate it. Then shatter these field-accurate writeups into atomic parts in 4.6 at the same depth as the monks. (Snowmobile logic — donors chosen for the function they contribute. Test-run evidence: a biology donor, organ-rejection-requires-active-immunosuppression, out-produced two business-adjacent donors precisely because it came from far away.)

   **Equal depth means equal — and the bias makes its last stand here.** The legibility habit reappears at the research step: you will be tempted to deeply research the donor you already half-understand and wave the foreign one through "conceptually, without deep research" — or drop it outright. That silently re-stacks the sea toward what you already know and defeats the entire blind pipeline. The _distant, less-legible_ donor is the one most likely to carry genuinely new vocabulary, so it earns equal or _more_ research time, never less. If a donor is too unfamiliar to research, that is exactly why it belongs in the sea — not a reason to discard it.

**Ingest the donor research into the wiki in the background.** Hand each finalized donor's field-accurate writeup to the **gardener** → a `donor` page (`reference/dialectic-wiki.md`), then continue all independent Stage B work. Do not wait at handoff; synchronize only when a later operation needs those pages or the Stage B gate has no other unfinished items. The page preserves the field's own vocabulary and mechanisms, tagged with meta-domain, epistemological register, and its `[fit:]` calibration. This is some of the most novel cross-domain material the skill produces — persisting it lets a later round re-shatter the donor without re-recruiting it, and it is prime re-grounding material. `donor` pages are orchestrator-side (they feed the decomposition and synthesis) and are **not** placed in monk briefs.

**After blindness has done its job, build a separate user on-ramp scaffold.** The field-accurate research above is optimized for decomposition, not comprehension. Do not paste it into the Phase 4 report or compress it into a denser mini-encyclopedia. The sighted orchestrator now knows both the donor and the user, so draft a short translation layer for each finalized donor. Keep this layer separate from the donor page so personalization cannot leak backward into recruitment or research. At this stage, write the bridge, scene, mechanism, and vocabulary; **do not assign the final transfer or `[fit:]` calibration yet** — Stage C's decomposition must earn those.

Write for an intelligent beginner in this donor field. Use this sequence:

1. **Familiar bridge.** Begin with 1–2 sentences anchored in something the user has actually demonstrated they understand — their work, vocabulary, history, interests, or a concrete example from the interview. Do not infer a personality type or flatter them. The bridge should reduce the number of new things they must learn at once.
2. **Concrete donor scene.** Describe one real, imaginable case inside the donor field before abstracting it. Let the user see what happens there. The first paragraph should contain **no unexplained native jargon, symbols, or taxonomies**.
3. **Plain-language mechanism.** State the useful operation in ordinary language: “the interesting move is…” or equivalent. Explain the phenomenon on its own terms before mapping it home.
4. **Native vocabulary, second.** Only now introduce at most **three** technical terms, each defined inline in plain language. The terms preserve the donor's generative precision; they are not the entrance fee.
5. **Reserve the transfer and limit.** Note the candidate connection that caused recruitment, but leave the final home-problem transfer, `[fit:]` calibration, and analogy limit for Stage D after decomposition. Personalization changes the route into the idea, not the donor's meaning or assessed fit.

Aim for roughly **120–220 words in 2–4 short paragraphs per surfaced donor**. Use more space when the field is especially foreign; “crisp” must not mean “compressed until only an expert can parse it.” In user-facing material, present donors one at a time under descriptive headings. Do not collapse several foreign fields into a dense comparison table unless the user explicitly asks for one.

One special case the blind brief handles naturally: when a monk makes a claim that _resists_ analytical treatment, the abstract pattern will pull domains that take that kind of claim seriously on their own terms (4.6 step 5 verifies this happened).

**Pool size:** the N monks **+ ~3–5 donors**, weighted toward functional donors with 1–2 random donors for anti-habit novelty. Each donor is a first-class domain entering 4.6's decomposition at the **same depth as the monk positions** — not a 2–3 paragraph isomorphism garnish. List the donors in the 4.6 domain manifest. The actual isomorphism-finding moves to 4.6 step 3, where donors are already decomposed as peers.

**Why this works:** Boyd's cross-domain step made mandatory _and_ multi-domain. Domain distance correlates with novelty; functional targeting correlates with relevance — you want both. Within-domain recombination cannot produce new vocabulary; a deep, functionally-targeted sea can.

### 4.5c Non-Propositional Pause

Before proceeding to decomposition, pause the analytical engine. Write **three metaphors** for the contradiction you just analyzed. Not explanatory metaphors — evocative ones. What does this tension _feel like_? What does it _look like_? What does it _sound like_?

Keep this to 2 paragraphs maximum. Extract 3-5 structural observations from the metaphors before proceeding.

---

**Completion gate — enumerate and attest before Stage C.** Apply the [workflow completion gate](dialectic-workflow.md#completion-gate), mark each item ✅ or ❌ with evidence, and stop on any ❌ unless the user explicitly waives it:

- [ ] 4.5a compressed conflicts (oxymorons) generated
- [ ] 4.5b donor pool recruited **blind** — brief provenance lock + register tags; recruiter read the Outline itself; final set selected under the blind rules (negation coverage, ≥3 unrelated meta-domains, register spread on both axes)
- [ ] Distance veto applied (no home field or its neighbor); domain manifest written for carry into 4.6
- [ ] Each donor researched for its own technical vocabulary
- [ ] Donor research ingested by the gardener as `donor` pages (meta-domain + register + `[fit:]` tags)
- [ ] A separate user on-ramp scaffold written for each finalized donor (familiar bridge → concrete scene → plain mechanism → ≤3 defined terms; final transfer + limit reserved for post-decomposition calibration); raw donor research not reused as user-facing copy
- [ ] 4.5c three metaphors written; 3–5 structural observations extracted
- [ ] All 4.5 output written to `round_N_determinate_negation.md`
- [ ] Instrument ledger contains complete `defamiliarize` and `donor-perturb` raw readings: authorization, actual seats and blind contexts, leak and distance controls, donor/research traces, access deltas, typed readings, artifact risks, unmeasured remainders, and any fallback downgrade; later interpretation remains separate

Then read `reference/phase4-stage-c-decomposition.md`.
