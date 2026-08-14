# MVP Build Spec — Sport Sponsorship Marketplace

This is the build spec for the hackathon MVP. Read `marketplace_master.md` first for the idea and context. This document is what to actually build.

## Goal

A working, demoable web app showing the **sponsor-side match flow**: a sponsor completes a quiz, an AI-style engine returns matched clubs/athletes with reasons, and the sponsor can view a match and connect. This is the single most persuasive slice for a room full of sponsors. Build this, not the whole marketplace.

## Scope boundaries

**In scope (build):**
- Sponsor onboarding quiz funnel
- Match results screen (the hero)
- Match detail + connect action
- A club/athlete profile data set (hardcoded)
- Matching logic (deterministic scoring, presented as "AI matching")

**Out of scope (do NOT build, mention as vision only):**
- Real backend / database / auth
- The club-side and athlete-side onboarding
- The verified check-in / trust layer
- Payments / commission processing
- Real LLM calls (optional stretch only, with a fallback)

## Tech stack

- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS (clean, modern, product-grade, not prototype-looking)
- **State:** React useState / useReducer, all in-memory, no backend
- **Data:** hardcoded TypeScript arrays (profiles, sponsor personas)
- **Matching:** pure TypeScript scoring function, no API
- **Optional stretch:** a single LLM call to generate match-reason text, behind a feature flag, with a hardcoded fallback so the demo never breaks

Keep it a single deployable frontend. No server required. Deployable to Vercel/Netlify or run locally for the demo.

## Architecture

```
src/
  data/
    profiles.ts        // club & athlete profiles (the supply side)
    sponsorQuiz.ts     // quiz questions + answer options
  lib/
    matching.ts        // scoring function: quiz answers -> ranked matches with reasons
    types.ts           // shared TypeScript types
  components/
    Quiz/
      QuizFunnel.tsx    // multi-step quiz, progress bar, one question per screen
      QuizStep.tsx      // single question with tappable options
    Matches/
      MatchResults.tsx  // hero screen: ranked match cards
      MatchCard.tsx     // one club/athlete card with score + reason
      MatchDetail.tsx   // full profile + connect button
    common/
      ProgressBar.tsx
      Button.tsx
  App.tsx               // orchestrates: quiz -> results -> detail (simple state machine)
  main.tsx
```

## Data model (types.ts)

```ts
type Region = 'Tallinn' | 'Tartu' | 'Pärnu' | 'Narva' | 'National';

type Demographic = 'youth' | '18-34' | '35-54' | 'families' | 'all';

type Goal = 'brand-awareness' | 'local-presence' | 'youth-engagement' | 'national-reach';

interface Profile {
  id: string;
  name: string;
  type: 'club' | 'athlete';
  sport: string;
  region: Region;
  audienceSize: number;        // verified-style number for the demo
  demographics: Demographic[]; // who they reach
  reach: {                     // channel reach
    matchAttendance: number;
    socialFollowers: number;
  };
  results: string;             // short profile/credibility line
  activation: string[];        // what a sponsor gets (jersey, LED boards, social, etc.)
  dealRange: [number, number]; // suggested sponsorship range in EUR
  imageHint: string;           // placeholder image label
}

interface SponsorAnswers {
  budget: number;              // chosen budget
  demographic: Demographic;    // target audience
  region: Region;              // target region
  goal: Goal;                  // campaign goal
}

interface Match {
  profile: Profile;
  score: number;               // 0-100 fit score
  reasons: string[];           // 1-3 human-readable reasons
}
```

## The matching logic (matching.ts) — this is the "AI"

Deterministic scoring, presented as AI matching. No model needed.

```
function matchSponsorToProfiles(answers: SponsorAnswers, profiles: Profile[]): Match[]
```

Scoring rules (tune weights so results feel smart):
- **Demographic fit** (heavy weight): +40 if the profile's demographics include the sponsor's target demographic; partial if adjacent.
- **Region fit** (heavy weight): +30 if profile region matches sponsor region; national profiles get partial credit for any region.
- **Budget fit** (medium): +20 if the sponsor's budget falls within the profile's dealRange; partial if close.
- **Goal fit** (medium): +10 mapped sensibly (e.g. youth-engagement favors profiles with youth demographic; national-reach favors national/high-reach profiles).

Normalize to 0-100. Sort descending. Return top 3-5.

**Reasons generation:** build 1-3 template strings from whichever factors scored highest, e.g. "Reaches your target {demographic} audience in {region}", "Audience size fits your {budget} budget", "Strong fit for {goal}". This makes each match feel explained and intelligent.

## Screens / flow (App.tsx state machine)

State: `'quiz' | 'results' | 'detail'`

1. **quiz** — QuizFunnel renders one question at a time with a progress bar. On completion, store SponsorAnswers, run matchSponsorToProfiles, move to results.
2. **results** — MatchResults shows ranked MatchCards (name, sport, region, audience, score %, one reason line). Click a card -> detail.
3. **detail** — MatchDetail shows full profile, all reasons, activation options, deal range, and a Connect button. Connect -> confirmation state ("Request sent to {name}").

Add a small "Start over" affordance to re-run the quiz with different answers during the demo (so you can show different sponsor personas producing different matches).

## Seed data (fill with the team — 20 min)

Create 5-6 realistic Estonian profiles in profiles.ts. Use real cities and plausible numbers. Mix clubs and athletes, mix regions and demographics so different quiz answers produce visibly different matches. Example shape (invent the rest):

- A mid-tier football club in Tartu, audience ~1,500, 18-34, local-presence fit.
- A youth basketball club in Tallinn, audience ~800, youth, youth-engagement fit.
- A national-level athlete, high social reach, national, national-reach fit.
- A small club in Pärnu, families, local.
- etc.

Also define 2-3 sponsor personas (as preset quiz answers) so the demo has repeatable, contrasting runs.

## Styling direction

- Clean, modern SaaS product look. Think a polished B2B marketplace, not a hackathon prototype.
- Use Tailwind. Consistent spacing, a real color system (pick one primary accent), rounded cards, subtle shadows.
- Match cards should look premium — the score %, a small demographic/region tag row, and the reason line.
- Mobile-friendly, since a lot of demo screens are shown on phones/projectors.

## Build order (always keep something demoable)

1. types.ts + profiles.ts (hardcode the data first)
2. matching.ts (the scoring function) — test it in isolation
3. MatchResults + MatchCard with static answers (get the hero screen working immediately)
4. QuizFunnel + QuizStep + ProgressBar (feed real answers into matching)
5. MatchDetail + connect confirmation
6. Styling polish pass
7. (Stretch) optional LLM-generated reasons behind a flag, with the template version as fallback

If time runs out, steps 1-4 (quiz -> matches) are a complete, winning demo.

## Demo safety

- Record a screen capture of the full flow once it works. If the live demo fails on stage, play the recording.
- Keep everything client-side so there is no server/wifi failure point.
- Preload the app before presenting; do not rely on a live build during the pitch.

## Optional stretch (only if ahead of schedule)

- Real LLM call to generate the match reasons, using the sponsor answers + profile as input, behind a feature flag, defaulting to the template reasons if the call fails or is disabled.
- A tiny "vision" screen or toggle showing the full marketplace (club side, athlete side, trust layer) as static mockups, to gesture at the bigger picture without building it.
