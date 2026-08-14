# Sponsorship Marketplace — Hackathon MVP

Sponsor-side match flow for a Baltic sport sponsorship marketplace.
Built for the Estonian Olympic Committee × YESS hackathon, Tallinn 2026.

A sponsor answers five questions. A deterministic scoring engine (presented as
"AI matching") returns ranked clubs and athletes, each explained — **and each
priced against the tax relief the sponsor is entitled to and probably is not
using.** That tax layer is the differentiator; everything else is table stakes.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # matching + tax unit tests
npm run build    # typecheck + production build
```

No backend, no API keys, no network calls. Everything is client-side, which is
deliberate: there is no server or wifi failure point during the demo.

## The demo, in three runs

The start screen has three preset personas. Run them in this order:

1. **Local gym, Tartu** — small budget, youth, one city. Estonian matches only,
   Estonian tax-free allowance on every card. This is the room's run.
2. **Estonian bank** — national reach, 18–34. Surfaces the national athlete.
3. **Baltic beverage brand** — Lithuania, national. The Vilnius club with
   official support-recipient status comes up at 100 fit:
   **€30,000 writes €60,000 off taxable profit, ≈ €9,000 back in cash.**
   This is the money shot, and it doubles as the Baltic scale story.

"Start over" or the header logo resets to the persona picker.

## Architecture

```
src/
  data/
    profiles.ts       8 seed clubs/athletes across EE, LV, LT
    personas.ts       3 preset sponsor answer sets (the demo runs)
    sponsorQuiz.ts    quiz questions, budget bands, region lists
  lib/
    types.ts          shared types
    taxRules.ts       per-country tax benefit computation — the wedge
    matching.ts       scoring: answers + profiles -> ranked, explained matches
    matching.test.ts  unit tests incl. demo guarantees
  components/
    Quiz/             QuizFunnel, QuizStep
    Matches/          MatchResults, MatchCard, MatchDetail
    common/           Button, Badge, ProgressBar
  App.tsx             state machine: start -> quiz -> results -> detail
```

## How the matching works

Deterministic, no model. Raw points, clamped at 100 — never rescaled, because a
perfect audience match without tax status must still read as a high number.

| Factor | Max | Notes |
|---|---|---|
| Demographic | 40 | exact 40, `all` wildcard 28, adjacent 20 (explicit table) |
| Geography | 30 | exact city 30, national-in-country 30/20, other city 8, cross-border 0 |
| Budget | 20 | inside `dealRange` 20, within 50% 10 |
| Goal | 10 | mapped per goal, 4 floor |
| Tax bonus | +8 | +8 for 200% status, +4 for allowance |
| Verified bonus | +4 | rewards trust-layer data |

**Two hard market rules**, both covered by tests:

- Profiles from another country are **filtered out entirely**, not merely scored
  zero on geography. Scoring alone leaked foreign profiles into results via
  demographic/budget/goal points — the tests caught it.
- A reason line never claims a profile reaches an audience in a city it is not
  in. A Tallinn club reads "…from Tallinn", never "…in Tartu".

## The tax layer

`taxRules.ts` models three legally distinct mechanisms as a discriminated union,
*not* one numeric multiplier — Lithuania's enhanced deduction and Estonia's
tax-free allowance are different things and collapsing them produces wrong copy.

| Kind | Country | Deduction | Cash effect shown |
|---|---|---|---|
| `multiplier` | LT, with support-recipient status | 2× the sponsorship | at 15% CIT |
| `allowance` | EE, registered recipient | tax-free within allowance | vs. 20% CIT |
| `none` | LV / no status | ordinary marketing spend | — |

Cards lead with the dramatic figure and back it with the real one
(`€2,000 off taxable profit` / `≈ €300 lower tax bill`). The caveat
("subject to recipient status and statutory caps") appears on the detail screen
only, so the card stays clean.

**Before this is shown to a real sponsor**, the LT 200% rules and caps, the EE
allowance thresholds, and the LV position each need confirming against current
law with a tax adviser. See §13 of `docs/marketplace_master.md`.

## Tuning knobs for the demo

- Weights and the adjacency table live at the top of `src/lib/matching.ts`.
- Seed profiles are in `src/data/profiles.ts` — swap in real club names and
  numbers and the demo gets sharper immediately.
- The Tartu persona currently ranks the Tallinn youth club above the Tartu
  football club, because demographic outweighs geography and the Tartu club is
  18-34/35-54 rather than youth. If you want the local club to win that run,
  either add `youth` to its demographics or raise the geography weight.

## Docs

`docs/` holds the thinking behind the build:

- `marketplace_master.md` — full idea, model, competition, risks, pitch
- `BUILD_SPEC_v2.md` — the spec this repo implements
- `BUILD_SPEC_v1_SUPERSEDED.md` — earlier spec, incompatible data model, kept for history
- `idea_baltics.md`, `YESS_sport_theme_prep.md` — adjacent background

## Out of scope, on purpose

No backend, auth, club-side onboarding, payments, or check-in capture. The
"Verified audience" badge is a boolean on seed data that *visualizes* the trust
layer without building it.
