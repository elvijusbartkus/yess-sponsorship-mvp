# Sponsorship Marketplace — Hackathon MVP

A two-sided marketplace that brings private money into sport by connecting clubs
and athletes who need funding with businesses who have money and want audience.
Built for the Estonian Olympic Committee × YESS hackathon, Tallinn 2026.

**The story:** sport has audiences but no market to sell them. Local businesses
have money and want local attention but cannot find, evaluate or back the right
club. We match the two on audience, region, budget and goal, so private money
finally flows into the middle and lower tiers that sponsors ignore today. Tax
efficiency is one reason a sponsor says yes — not the reason the product exists.

Implements `docs/BUILD_FIXES.md` (spec v3).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 19 matching + tax unit tests
npm run build    # typecheck + production build
```

No backend, no API keys, no network calls — nothing to fail on stage.

## Two flows, both real

The landing page has two equally prominent doors and both lead to working flows.

**Flow A — sponsor ("I want to back sport")**
Six tappable questions (country, budget band, audience, region, goal, and an
optional "what matters most") → ranked matches with fit score, audience, deal
range, a specific reason and a restrained tax line → match detail → connect →
"Request sent".

**Flow B — club/athlete ("I want funding")**
Eight-step profile builder (name, club/athlete, sport, country, region, audience,
social, activation, deal range) → a live profile preview showing exactly how
sponsors will see them, plus an illustrative view of who is searching right now.

Quick-start presets for both sides sit at the bottom of the landing page so
neither flow needs typing during a demo.

## Suggested demo order

1. **Local gym, Tartu** — small budget, youth, one city. Shows the core promise.
2. Hit the **Rank by** chips on the results screen — the ranking visibly
   reorders, which is the most convincing thing in the demo.
3. **Lithuanian beverage brand** — the Vilnius club with support-recipient
   status, where enhanced relief actually applies.
4. **Small football club** (club side) — profile live in two minutes, with real
   sponsor demand visible underneath.

## Architecture

```
src/
  data/
    profiles.ts       8 seed clubs/athletes across EE, LV, LT
    personas.ts       3 preset sponsor runs
    sponsorQuiz.ts    questions, budget bands, regions, priorities
    clubFlow.ts       club-side options, seeds, demand signal
  lib/
    types.ts          shared types
    taxRules.ts       per-country tax computation
    matching.ts       scoring -> ranked, explained matches
    matching.test.ts  unit tests
  components/
    Landing.tsx       two doors
    Quiz/             QuizFunnel, QuizStep
    Matches/          MatchResults, MatchCard, MatchDetail
    Club/             ProfileBuilder, LiveProfile
    common/           Button, Badge, ProgressBar
  App.tsx             state machine across both flows
```

## Matching

Deterministic, no model. Raw points, clamped at 100 — never rescaled.

| Factor | Max | Notes |
|---|---|---|
| Demographic | 40 | exact 40, `all` 26, genuinely adjacent 16, otherwise 0 |
| Geography | 30 | exact city 30, national-in-country 30/18, other city 5, cross-border 0 |
| Budget | 20 | band overlaps `dealRange` 20, near miss 9 |
| Goal | 10 | mapped per goal, 3 floor |
| Priority (Q6) | 22 | optional; weighted to actually reorder, not just nudge |
| Verified | 5 | small trust bonus |

**Weak matches are forced low.** A profile whose audience does not overlap the
target is capped at 45 regardless of how well everything else scores, and an
adjacent-only match is capped at 72. Without that cap a card could show 87 next
to its own "audience does not overlap your target" note — a straight
contradiction, and exactly what the spec forbids.

Other rules, all covered by tests:

- Profiles from another country are **filtered out**, not merely scored zero —
  scoring alone let foreign profiles leak in on demographic/budget/goal points.
- Reasons are built from that profile's actual top-scoring factors, in its own
  numbers. Every match on a run gets a distinct top reason.
- A reason never claims a profile reaches an audience in a city it is not in.
- Weak matches carry an explicit honest `caution` line.
- **Tax status does not influence rank at all** — there is a test asserting two
  otherwise-identical profiles score the same regardless of tax status.

## Tax treatment

One restrained line on the card (no euro figure, so cards don't read alike), the
full picture on the detail screen. Three legally distinct mechanisms modelled as
a discriminated union, not one multiplier:

| Kind | Country | Effect | Rate used |
|---|---|---|---|
| `multiplier` | LT, support-recipient status | 2× deduction from taxable profit | 16% CIT |
| `allowance` | EE, registered recipient | tax-free within allowance | 22% distribution tax |
| `none` | LV / no status | ordinary marketing spend | — |

Where no status applies, **no saving is displayed at all** — no invented euro
figure, ever. Detail screens show sponsorship amount, tax saved and real cost
together, plus the caveat that this is indicative and subject to recipient status
and statutory caps.

**Verify before quoting on stage.** The LT 200% deduction is capped (a share of
taxable profit) and requires formal recipient status; the EE allowance thresholds
and the LV position also need confirming against current law with an adviser.

## Commission

Free to join, free to browse, free to connect. The platform earns only when a
deal closes — 2% on large deals, 10% on small. This copy appears on the landing,
the results screen and the connect action. The product never charges for contact.

## Docs

- `BUILD_FIXES.md` — spec v3, what this repo implements
- `marketplace_master_v2.md` — research-backed master doc
- `marketplace_master.md`, `BUILD_SPEC_v2.md`, `BUILD_SPEC_v1_SUPERSEDED.md` — earlier iterations
- `idea_baltics.md`, `YESS_sport_theme_prep.md` — background

**Known doc conflict:** `marketplace_master_v2.md` calls the tax engine "the
differentiator" and opens on the unused billion, while `BUILD_FIXES.md` says not
to over-index on tax. The build follows BUILD_FIXES. The pitch deck still needs
reconciling to match.

## Out of scope, on purpose

No backend, auth, payments, or check-in capture. The "Verified audience" badge is
a boolean on seed data that visualizes the trust layer without building it.
Demand figures on the club side are labelled illustrative.
