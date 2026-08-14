# MVP Build Spec — Sport Sponsorship Marketplace

*Spec v2.1. Supersedes `BUILD_SPEC_v1_SUPERSEDED.md` — do not build from that file, its data model is incompatible.*

This is the build spec for the hackathon MVP. Read `marketplace_master.md` first for the idea and context. This document is what to actually build.

## Goal

A working, demoable web app showing the **sponsor-side match flow**: a sponsor completes a quiz, an AI-style engine returns matched clubs/athletes with reasons **including a tax-benefit line**, and the sponsor can view a match and connect. This is the single most persuasive slice for a room full of sponsors. Build this, not the whole marketplace.

## The differentiator that MUST be visible: tax optimization

Market research confirmed the closest competitor is Sponsoo (Germany), a proven two-sided sponsorship marketplace with commission-on-close and free supply-side. Sponsoo validates the model but is NOT in the Baltics and does NOT do tax-optimized matching. Our wedge is the tax layer. The demo must show that a match is not just an audience fit but a **financial instrument**:

- **Lithuania:** a sponsor can deduct **200%** of the sponsored amount from taxable profit — a €1,000 sponsorship writes €2,000 off the taxable base — where the recipient holds official support-recipient status.
- **Estonia:** companies can give tax-free up to 3% of paid wages or 10% of prior-year profit, and this capacity is almost entirely unused.
- **Latvia:** relief exists but is narrower and status-gated, so most club sponsorship there is straight marketing spend.

Every match card must surface the tax benefit. This is the single most important thing that makes the demo stand out from a generic "Tinder for sponsorship." It is a headline feature on the match card and the detail screen, not a footnote.

**Lead with the big number, back it with the real one.** The card headline is the dramatic figure (`€1,000 → €2,000 off taxable profit`). Directly under it, in smaller text, show the cash effect (`≈ €300 lower tax bill at 15% CIT`). This is not hedging — it is what makes the claim survive a sponsor doing the arithmetic in their head, and a differentiator that survives scrutiny is worth more than one that doesn't. Keep caveats to a single quiet line on the **detail** screen only (`Subject to recipient status and statutory caps.`); the card stays clean.

## Scope boundaries

**In scope (build):**
- Sponsor onboarding quiz funnel
- Match results screen (the hero)
- Match detail + connect action
- A club/athlete profile data set (hardcoded)
- Matching logic (deterministic scoring, presented as "AI matching")
- Tax-benefit computation and display (the wedge)
- "Verified audience" **badge display only** — a boolean on seed data, rendered as a badge

**Out of scope (do NOT build, mention as vision only):**
- Real backend / database / auth
- The club-side and athlete-side onboarding
- The verified check-in **capture mechanism** (no scanning, no event flow — only the badge above)
- Payments / commission processing
- Real LLM calls (optional stretch only, with a fallback)

## Tech stack

- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS (clean, modern, product-grade, not prototype-looking)
- **State:** React useState / useReducer, all in-memory, no backend
- **Data:** hardcoded TypeScript arrays (profiles, sponsor personas)
- **Matching:** pure TypeScript scoring function, no API
- **Tests:** Vitest, for the matching function only
- **Optional stretch:** a single LLM call to generate match-reason text, behind a feature flag, with a hardcoded fallback so the demo never breaks

Keep it a single deployable frontend. No server required. Deployable to Vercel/Netlify or run locally for the demo.

## Architecture

```
src/
  data/
    profiles.ts        // club & athlete profiles (the supply side)
    sponsorQuiz.ts     // quiz questions + answer options
    personas.ts        // 2-3 preset sponsor answer sets for repeatable demo runs
  lib/
    types.ts           // shared TypeScript types
    taxRules.ts        // per-country tax benefit computation (the wedge)
    matching.ts        // scoring function: quiz answers -> ranked matches with reasons
    matching.test.ts   // Vitest unit tests for scoring
  components/
    Quiz/
      QuizFunnel.tsx    // multi-step quiz, progress bar, one question per screen
      QuizStep.tsx      // single question with tappable options
    Matches/
      MatchResults.tsx  // hero screen: ranked match cards
      MatchCard.tsx     // one club/athlete card with score + reason + tax line
      MatchDetail.tsx   // full profile + connect button
    common/
      ProgressBar.tsx
      Button.tsx
      Badge.tsx
  App.tsx               // orchestrates: quiz -> results -> detail (simple state machine)
  main.tsx
```

## Data model (types.ts)

```ts
type Country = 'EE' | 'LV' | 'LT';

// Regions are city-level only. "National" is NOT a region — it is a separate
// flag on the profile, scoped by country, so a national Estonian athlete and a
// national Lithuanian club are never treated as the same geography.
type Region =
  | 'Tallinn' | 'Tartu' | 'Pärnu' | 'Narva'   // EE
  | 'Riga' | 'Liepāja'                         // LV
  | 'Vilnius' | 'Kaunas';                      // LT

type Demographic = 'youth' | '18-34' | '35-54' | 'families' | 'all';

type Goal = 'brand-awareness' | 'local-presence' | 'youth-engagement' | 'national-reach';

// Tax benefit is a discriminated union: LT's "deduct 2x the amount from the
// taxable base" and EE's "this is tax-free within an allowance" are different
// mechanisms and must not share one numeric multiplier field.
type TaxBenefit =
  | { kind: 'multiplier'; factor: number; corporateTaxRate: number }  // LT: factor 2.0
  | { kind: 'allowance'; corporateTaxRate: number }                   // EE: tax-free within limit
  | { kind: 'none' };                                                 // LV / no status

interface Profile {
  id: string;
  name: string;
  type: 'club' | 'athlete';
  sport: string;
  country: Country;            // drives which tax rule applies
  region: Region;              // home city
  isNational: boolean;         // true = national reach WITHIN its country
  audienceSize: number;
  audienceVerified: boolean;   // true = verified via trust layer, false = self-reported
  demographics: Demographic[]; // who they reach
  reach: {
    matchAttendance: number;
    instagramFollowers: number;
    facebookFans: number;
    pressMentions: number;
  };
  results: string;             // short achievements/credibility line
  activation: string[];        // what a sponsor gets: jersey, LED boards, social posts, etc.
  dealRange: [number, number]; // suggested sponsorship range in EUR
  taxStatus: {
    hasSponsorshipStatus: boolean; // holds official recipient status (esp. LT 200%)
    benefit: TaxBenefit;
    note: string;                  // human-readable tax benefit line
  };
  currentSponsors: string[];   // social proof, can be empty
  imageHint: string;           // placeholder image label
}

// The quiz asks for a budget BAND, not a free number. `budget` is the
// representative midpoint used for scoring; `budgetBand` is what we display.
interface BudgetBand {
  id: string;
  label: string;               // "€1,000 – €5,000"
  min: number;
  max: number;
  midpoint: number;
}

interface SponsorAnswers {
  budgetBand: BudgetBand;
  budget: number;              // == budgetBand.midpoint, used by scoring
  country: Country;            // sponsor's home market
  demographic: Demographic;    // target audience
  region: Region | 'National'; // 'National' means national within `country`
  goal: Goal;
}

interface Match {
  profile: Profile;
  score: number;               // 0-100 fit score
  reasons: string[];           // 1-3 human-readable reasons
  taxBenefit: {
    headline: string;          // "Your €1,000 writes €2,000 off taxable profit"
    subline: string;           // "≈ €300 lower tax bill at 15% CIT"
    deductibleAmount: number;
    cashSaving: number;
    caveat: string;            // shown on detail screen only
  };
  verifiedBadge: boolean;
}
```

## Tax rules (taxRules.ts)

One pure function, no UI:

```ts
function computeTaxBenefit(budget: number, profile: Profile): Match['taxBenefit']
```

- `kind: 'multiplier'` (LT with support-recipient status, factor 2.0, CIT 15%):
  - `deductibleAmount = budget * 2`
  - `cashSaving = deductibleAmount * 0.15`
  - headline: `Your €1,000 writes €2,000 off taxable profit`
  - subline: `≈ €300 lower tax bill at 15% corporate income tax`
- `kind: 'allowance'` (EE, CIT 20%):
  - `deductibleAmount = budget`
  - `cashSaving = budget * 0.20`
  - headline: `Fully tax-free under Estonia's donation allowance`
  - subline: `≈ €200 saved vs. taxed distribution — capacity almost nobody uses`
- `kind: 'none'` (LV, or a profile without recipient status):
  - `deductibleAmount = budget`, `cashSaving = 0`
  - headline: `Deductible as marketing spend`
  - subline: `No enhanced relief — priced as pure audience value`

`caveat` is always `Subject to recipient status and statutory caps.` and renders only on MatchDetail.

## The matching logic (matching.ts) — this is the "AI"

Deterministic scoring, presented as AI matching. No model needed.

```
function matchSponsorToProfiles(answers: SponsorAnswers, profiles: Profile[]): Match[]
```

**Scoring — raw points, max 100, then clamped (not rescaled):**

- **Demographic fit — max 40.**
  - Exact: profile.demographics includes answers.demographic → **40**
  - Wildcard: profile.demographics includes `'all'` → **28**
  - Adjacent (explicit table, no interpretation): → **20**
    - `youth` ↔ `families`
    - `18-34` ↔ `35-54`
    - `families` ↔ `35-54`
    - all other pairs → **0**
- **Geography fit — max 30.** Cross-border never scores; this is what keeps a Tartu gym off a Vilnius club.
  - same country **and** profile.region === answers.region → **30**
  - same country and answers.region === `'National'` and profile.isNational → **30**
  - same country and profile.isNational (sponsor asked for a city) → **20**
  - same country, different city, not national → **8**
  - different country → **0**
- **Budget fit — max 20.**
  - `answers.budget` inside `profile.dealRange` → **20**
  - within 50% outside either end → **10**
  - otherwise → **0**
- **Goal fit — max 10.**
  - `youth-engagement` and profile has `youth` → 10
  - `national-reach` and `profile.isNational` → 10
  - `local-presence` and NOT `profile.isNational` → 10
  - `brand-awareness` and `audienceSize >= 1000` → 10
  - otherwise → 4
- **Tax bonus — +8** if `profile.taxStatus.benefit.kind === 'multiplier'`, **+4** if `'allowance'`.
- **Verified bonus — +4** if `profile.audienceVerified`.

**Final: `score = Math.min(100, raw)`.** Do NOT divide by the theoretical maximum — a perfect audience match without tax status must still read as a high number, not 91%.

Sort descending, tie-break on `audienceSize` descending. Return the top 5.

**Reasons generation:** build 1-3 template strings from whichever factors scored highest, e.g. "Reaches your target {demographic} audience in {region}", "Audience size fits your {budgetBand.label} budget", "Strong fit for {goal}". This makes each match feel explained and intelligent.

**Verified badge:** `verifiedBadge = profile.audienceVerified`. Verified profiles show a "Verified audience" badge; self-reported ones show "Self-reported". This visualizes the trust layer without building the check-in system.

## Screens / flow (App.tsx state machine)

State: `'quiz' | 'results' | 'detail'`

1. **quiz** — QuizFunnel renders one question at a time with a progress bar. Questions: country, budget band, target demographic, region (city list filtered by chosen country, plus "National"), goal. On completion, store SponsorAnswers, run matchSponsorToProfiles, move to results.
2. **results** — MatchResults shows ranked MatchCards. Each card: name, sport, region/country, audience size, verified/self-reported badge, score %, one reason line, AND the tax-benefit headline + subline in an accented block. The tax block is visually prominent because it is the differentiator. Click a card → detail.
3. **detail** — MatchDetail shows the full profile: audience breakdown (attendance, Instagram, Facebook, press mentions), all reasons, activation options ("what you get"), current sponsors, deal range, the full tax explanation including the caveat line, verified badge, and a Connect button. Connect → confirmation ("Request sent to {name}").

Add a persona switcher on the quiz start screen (the presets from `personas.ts`) plus a "Start over" affordance, so different sponsor personas can be shown producing visibly different matches during the demo.

## Seed data (profiles.ts)

Create 8 realistic Baltic profiles. Real cities, plausible numbers. Mix clubs and athletes, mix countries, mix regions and demographics, mix verified vs self-reported, so different quiz answers produce visibly different matches AND the tax + verified differentiators are demoable.

**Demo geography rule: Estonia-first.** The default persona is Estonian and must return Estonian matches — this is an Estonian Olympic Committee room. Cross-border scoring is zero, so this happens naturally. The Lithuanian 200% club is the **second run**, surfaced by a "Baltic-wide brand" persona, where it becomes the dramatic tax moment and the scale story at once.

Seed mix:
- Mid-tier football club, Tartu (EE), audience ~1,500, 18-34, **verified**, EE allowance, local-presence fit.
- Youth basketball club, Tallinn (EE), audience ~800, youth, self-reported, youth-engagement fit.
- National-level Estonian athlete (track/triathlon), high social reach, `isNational`, **verified**, national-reach fit.
- Small multi-sport club, Pärnu (EE), families, self-reported, local.
- Handball club, Narva (EE), 35-54, self-reported, local-presence.
- **Lithuanian club WITH 200% support-recipient status (LT, Vilnius or Kaunas), verified — the star of the second run.**
- Second LT profile (athlete, Kaunas) without status, so LT itself shows a status/no-status contrast.
- Latvian hockey team (Riga, LV), families, self-reported, `kind: 'none'` — positioned as pure marketing spend.

The contrast between a verified LT club with 200% deduction and a self-reported LV team with no enhanced relief is what makes the tax + trust story land visually.

## Sponsor personas (personas.ts)

1. **Local Tartu gym** — EE, €1,000–5,000, youth, Tartu, local-presence. *(Run 1: the Estonian story.)*
2. **Estonian national bank** — EE, €10,000–50,000, 18-34, National, brand-awareness. *(Run 2: national reach.)*
3. **Baltic-wide beverage brand** — LT, €10,000–50,000, 18-34, National, brand-awareness. *(Run 3: the 200% tax moment + scale story.)*

## Styling direction

- Clean, modern SaaS product look. A polished B2B marketplace, not a hackathon prototype.
- Tailwind. Consistent spacing, one primary accent, rounded cards, subtle shadows.
- Match cards premium: score %, a demographic/region tag row, the reason line, the accented tax block.
- Mobile-friendly, since demo screens get shown on phones and projectors.

## Build order (always keep something demoable)

1. types.ts + taxRules.ts + profiles.ts (hardcode the data first)
2. matching.ts + matching.test.ts — test the scoring in isolation
3. MatchResults + MatchCard driven by a persona (hero screen working immediately)
4. QuizFunnel + QuizStep + ProgressBar (feed real answers into matching)
5. MatchDetail + connect confirmation
6. Styling polish pass
7. (Stretch) optional LLM-generated reasons behind a flag, template version as fallback

If time runs out, steps 1-4 (persona → matches) are a complete, winning demo.

## Demo safety

- Record a screen capture of the full flow once it works. If the live demo fails on stage, play the recording.
- Keep everything client-side so there is no server/wifi failure point.
- Preload the app before presenting; do not rely on a live build during the pitch.

## Optional stretch (only if ahead of schedule)

- Real LLM call to generate the match reasons from sponsor answers + profile, behind a feature flag, defaulting to template reasons if the call fails or is disabled.
- A "vision" screen showing the full marketplace (club side, athlete side, trust layer) as static mockups, to gesture at the bigger picture without building it.
