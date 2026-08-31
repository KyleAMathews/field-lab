# External Writer-Voice Profiles

A writer-voice profile is optional, user-controlled input to Essay drafting. It
describes the user's own recurring prose choices. Field Lab does not bundle a
personal profile, infer one from the user's identity, scan the filesystem for
one, or default to a named writer's voice.

## Selection contract

Use a profile only when the user explicitly selects it or the frozen editorial
brief already records that selection. Otherwise use the
[general writing guide](writing-guide.md) alone and do not interrupt drafting
to ask for a profile.

Record the selected profile's exact path or repository URL and, when available,
its version, commit, or content hash. Keep the profile itself outside the Essay
Field Log. The log holds only the pointer, version, applied constraints, and any
user corrections.

If the selected profile cannot be read, say so and fall back to the general
guide. Do not reconstruct it from memory or from scattered examples. Never
copy a private profile into a shared repository or published essay package.

## Profile shape

A useful profile may contain:

- identity, owner, intended uses, and version;
- a short voice description;
- observable axes such as distance, formality, pace, density, humor, and
  explicitness;
- favored patterns and the jobs they perform;
- anti-patterns and common failure modes;
- annotated excerpts written or approved by the owner; and
- provenance and revision notes.

Treat all rules as constraints to test against the present audience and source.
Do not turn frequencies in old writing into quotas. Do not use imitation of a
named writer as a substitute for observable instructions.

## Application

Before drafting, translate the selected profile into a short constraint set for
this essay. Preserve any tensions with the audience, publication, or evidence
boundary. Apply the governing order in the general guide:

1. current user instruction;
2. selected external profile;
3. audience and publication constraints;
4. general writing guide;
5. model defaults.

After cleanup, compare the draft with the applied constraints. Report material
departures and risky proposed rewrites. Do not silently change meaning to make
the prose sound more like the profile.
