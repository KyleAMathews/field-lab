# Phase 6: Validation of the Palette

Phase 6 validates the palette from Phase 5. The user selects which candidate(s) to validate — typically one or two, not all. Each selected candidate is validated **on its own terms** against its own internal standard, by the monks and by a hostile auditor.

**No tournament, no winner, no Borda count.** The user judges which candidate fits their situation. The monks and auditor produce structural critiques per candidate, not rankings across candidates.

**Critical ABS insight (still applies to S):** The monks don't *stop believing* after validation. A defeated monk has dropped its belief load — belief fell on the floor rather than being sublated. A properly elevated monk *believes more*. For non-S candidates (J/G/F/U), "elevation" means something different — see each candidate's validation prompt below.

## This phase is staged — read one stage file at a time

Phase 6 is long because each working step carries a full prompt for every candidate type (S/J/G/F/U). The setup below (6.0, 6.1) runs once, up front. The three working stages then repeat for each candidate under validation. **Do not read the stage files all at once** — for each stage: read the stage file, do its work, **write its output to file** (`round_N_validation_<candidate>.md`), then read the next stage.

| Stage | File | Sections | The move |
|---|---|---|---|
| A | `reference/phase6-stage-a-monk-validation.md` | 6.2 (S/J/G/F/U) | The monks validate each candidate |
| B | `reference/phase6-stage-b-hostile-auditor.md` | 6.3 (S/J/G/F/U) | A hostile auditor attacks each candidate |
| C | `reference/phase6-stage-c-interpret-refine.md` | 6.4, 6.5, 6.6 | Interpret per candidate, refine, present |

When validating a single candidate, you only use that candidate's sub-section within each stage (e.g. 6.2.S and 6.3.S) — read the stage file but apply only the relevant variant.

## 6.0 Select Candidates to Validate

The user picks which candidate(s) from the palette go into validation. Common patterns:
- **One candidate** the user finds most promising — validate it alone.
- **Two candidates** that feel like real alternatives — validate both and see which survives more intact.
- **All candidates** if the user wants maximum friction before deciding (expensive; rarely needed).

If the user defers the choice, validate S plus the non-S candidate that fired on the strongest lens signal (usually J if position-protection fired, otherwise whichever lens had the highest-signal finding).

## 6.1 Model Selection

Use the strongest available model with extended thinking for all validation agents. Validation is subtle — the monks must reason about whether their core insight was genuinely preserved or quietly destroyed; the auditor's value comes from catching what everyone else missed. Cost is low (reading short-to-medium essays), leverage is high.

---

Once the user has selected candidates (6.0) and you've set the model (6.1), read `reference/phase6-stage-a-monk-validation.md` and begin.
