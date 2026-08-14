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
npm run dev:all   # API on :8787 + web on :5173
npm test          # 42 unit tests
npm run build     # typecheck + production build
```

`npm run dev:all` runs both halves. To run them separately: `npm run server`
and `npm run dev`. Vite proxies `/api` to the backend, so nothing needs
configuring in dev.

### Optional: LLM match reasoning

Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY` to have Claude write
the "why we matched you" lines. **Without a key the app runs on template
reasons and everything else is identical** — the key is read server-side only
and never reaches the browser.

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

## The 60-second demo

```
Back sport → account (3 fields) → 3 taps → matching → matches
  → one match → Contact (membership gate) → deal room → Draft the campaign
```

Measured end to end in the browser: **~16 seconds of clicking, 10 clicks**,
including generating the campaign copy. The quiz is three questions; the two
refinement questions moved to live chips on the results screen, where changing
them visibly re-ranks the list — a better demo beat than a funnel step.

**Both revenue lines are screens, not claims:**

- **Membership gate** — browsing and matching are free, contacting is not. The
  Connect button reads "Contact this club · Membership" until a membership
  starts, then goes straight to the deal room.
- **Deal room** — three numbers and nothing else: deal value, our commission,
  what the club gets.

**The curation layer** sits under the deal: one "Draft the campaign" button
generates a launch post and a story caption for that specific sponsorship. It's
the anti-leakage argument made visible — we don't just introduce the two sides,
we run the marketing, because clubs and athletes are training rather than
selling themselves. Falls back to a template without an API key.

## Architecture

```
server/
  index.ts          Express API
  db.ts             SQLite schema + seed (profiles live in a real table)
  reasoning.ts      LLM match-reason text, with template fallback
  enrich.ts         real public-source corroboration lookup
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
  lib/api.ts          frontend HTTP client
  App.tsx             state machine across both flows
```

### API

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | profile count, whether LLM reasoning is on |
| `GET /api/profiles` | all clubs/athletes from the database |
| `POST /api/match` | sponsor answers → ranked, explained matches |
| `POST /api/profiles` | club/athlete self-registers (writes a row) |
| `POST /api/profiles/:id/enrich` | corroborate against a real public source |

**Ranking is computed server-side and deterministically, from the database.**
The LLM is invited afterwards, and only to rewrite the explanation text — it
cannot reorder matches, change a score, or invent a tax figure. If the call
fails, times out, refuses, or returns unusable JSON, that match silently keeps
its template reasons. There are tests asserting exactly this.

## Matching

Deterministic, no model. Raw points, clamped at 100 — never rescaled.

| Factor | Max | Notes |
|---|---|---|
| Demographic | 40 | exact 40, `all` 26, genuinely adjacent 16, otherwise 0 |
| Geography | 30 | exact city 30, national-in-country 30/18, other city 5, cross-border 0 |
| Budget | 20 | band overlaps `dealRange` 20, near miss 9 |
| Goal | 10 | mapped per goal, 3 floor |
| Priority (Q6) | 22 | optional; weighted to actually reorder, not just nudge |
| Corroborated | 5 | small trust bonus |

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

## The money model

Two revenue lines, both on the sponsor's side of the table. `src/data/pricing.ts`
is the single source of truth; the signup note, membership gate, deal room and
pricing screen all read from it, and tests assert they cannot diverge.

| Who | What | When |
|---|---|---|
| Clubs & athletes | **Free, always** — to list, to be matched, to be contacted | never |
| Sponsors | **€49/month** membership | to contact a club and close |
| Sponsors | **10%** up to €10,000, **2%** above | only on a closed deal |

Commission is charged **on top** of the sponsorship, so the club receives the
full agreed amount — the deal room shows this as its own line.

**Known tension with the pitch.** `marketplace_master_v2.md` §0 and §6.2 say
"nobody pays to join" and treat zero joining friction as the reason the model
beats subscription competitors (it explicitly cites OpenSponsorship's
subscription as a cautionary example). A membership gate reintroduces that
friction for the small local sponsor the pitch targets. If a judge raises it,
the honest answer is that the first connection could be free, or membership
waived below a deal-size threshold — the gate is a product decision, not a
constraint of the build.

## Docs

- `BUILD_FIXES.md` — spec v3, what this repo implements
- `marketplace_master_v2.md` — research-backed master doc
- `marketplace_master.md`, `BUILD_SPEC_v2.md`, `BUILD_SPEC_v1_SUPERSEDED.md` — earlier iterations
- `idea_baltics.md`, `YESS_sport_theme_prep.md` — background

**Known doc conflict:** `marketplace_master_v2.md` calls the tax engine "the
differentiator" and opens on the unused billion, while `BUILD_FIXES.md` says not
to over-index on tax. The build follows BUILD_FIXES. The pitch deck still needs
reconciling to match.

## Data trust — corroboration, not check-in

**There is no check-in / gate-attendance system, and building one is explicitly
out of scope** — it is a different product. Trust here comes from data that
already exists in public:

- **Corroborated** — the audience figure lines up with public follower counts,
  press coverage, and existing sponsor relationships we could check.
- **Self-reported** — club-entered only, nothing checked yet.

Where a self-reported figure materially exceeds what public signals support,
the card says so rather than quietly ranking on the inflated number.

`POST /api/profiles/:id/enrich` performs a **real, key-free network call** to
the Wikipedia REST API, records what it found with a timestamp, and writes the
provenance back to the database — so the badge is demonstrably not theatre.

**Honest scope note:** Instagram and Facebook follower counts are not readable
without platform credentials and app review, so no code here pretends to scrape
them. Existence and coverage are corroborated for real; live follower counts
need Meta Graph API access granted by each club, which is a business step and
is left as roadmap rather than faked.

## Deployment

**No backend required.** The app is a static site — build it, upload `dist/`,
done. On Vercel that means importing the repo and clicking deploy; `vercel.json`
is committed with the build config and SPA rewrite. Nothing to configure.

Everything the marketplace does — matching, scoring, tax, commission,
corroboration, campaign copy — is computation over data the app already ships,
so it runs in the browser. The public-source corroboration lookup is a real
network call that works client-side because Wikipedia sends
`access-control-allow-origin: *`.

### Optional: the backend

`server/` is still here and still works (`npm run dev:all`). The only thing it
buys you is **live LLM copy** — model-written match reasons and campaign posts
— because an API key must never reach the browser. Without it those fall back
to the same templates the server would have used anyway.

To use it: deploy `server/` (Render: build `npm install`, start `npm start`,
set `CORS_ORIGIN`), then set `VITE_API_URL` to `https://<host>/api` in the
frontend and rebuild. Leave `VITE_API_URL` unset and the app is standalone.

> Free-tier hosting sleeps after ~15 minutes and takes 30–50s to wake, which is
> a bad thing to hit mid-demo. That is the main reason the standalone path is
> the default.

## Out of scope, on purpose

No auth, no payments, no check-in capture. Demand figures on the club side are
labelled illustrative.
