# Make it real: backend + LLM + honest data trust

Goal: move from hardcoded demo to a real, polished app with a backend, an LLM-powered matching/reasoning layer, and an honest data-trust model that does NOT depend on a check-in system (that is explicitly out of scope — another product). Keep the existing UI/flow; upgrade what's underneath.

## Scope decision (locked)
- NO check-in / gate-attendance system. Out of scope. Do not reference building it.
- Data trust comes from PUBLIC + EXISTING sources, not from us capturing attendance.

## Data trust model (replaces the check-in story)
"Verified" no longer means attendance counted at the gate. It means audience figures corroborated by data that already exists:
- Social reach: real follower counts (Instagram/Facebook/TikTok — public or via API).
- Press mentions: count of media coverage (searchable/scrapeable).
- Existing sponsors: logos/relationships as credibility signal.
- Consistency check: self-reported numbers cross-checked against public signals; big mismatches flagged.

Badge meaning:
- "Corroborated" (was "Verified"): audience backed by public data we could check.
- "Self-reported": club-entered only, not yet corroborated.

Update badge copy accordingly. This is honest and needs no check-in system.

## Architecture (backend + LLM)

```
Frontend (React) 
  → Backend API (Node/Express or Next.js API routes; or Python FastAPI)
    → Data store (Postgres or SQLite for the demo; a real DB, not hardcoded)
    → LLM (Anthropic API) for: (a) match reasoning text, (b) optional natural-language matching
    → (optional) enrichment: pull public social counts for a profile
```

### Backend
- A real backend service with endpoints:
  - `GET /profiles` — returns clubs/athletes from the DB.
  - `POST /match` — takes sponsor answers, returns ranked matches with scores.
  - `POST /profiles` — club/athlete self-registers (writes to DB).
- Use Postgres (or SQLite if simpler for the demo). Seed it with the same 6–8 Baltic profiles, now stored in a real table, not a JS array.
- This gives you a genuine data layer: profiles live in a database, added via the club flow, read by the sponsor flow.

### Matching: deterministic score + LLM reasoning (hybrid — most reliable)
- Keep the deterministic scoring function on the backend (demographic/region/budget/goal weights). This guarantees correct, explainable ranking and never fails.
- Use the LLM ONLY to generate the human-readable "why we matched" text from the structured match result. This makes reasons feel natural and smart without letting the LLM control ranking (which could hallucinate).
- Prompt shape: "Given this sponsor (budget/audience/region/goal) and this matched profile (data), write 2 short reasons this is a good match. Be specific and honest. If the match is weak on a dimension, say so." Return text only.
- IMPORTANT: have a fallback. If the LLM call fails or is slow, fall back to template reasons so the demo never breaks.

### Optional enrichment (nice-to-have, shows the data trust is real)
- An endpoint that, given a profile's social handle, fetches the real public follower count and stores it. Even doing this for 1–2 demo profiles proves the "corroborated" badge is real, not faked.

## Hosting (makes it feel like a real app)
- Deploy frontend + backend so it's a live URL, not localhost.
  - Frontend: Vercel/Netlify.
  - Backend + DB: Railway, Render, or Supabase (Postgres). Supabase gives you Postgres + hosting fast.
- A live URL you can open on any device is a big credibility jump for the demo.

## Loading states (polish)
- Real backend calls take time, so show proper loading states:
  - Matching screen: the animated "Scanning… Matching… Calculating…" while the /match call runs.
  - Skeleton loaders on profile/detail while data fetches.
- This is where loading screens become genuine, not fake, because there's a real request behind them.

## Polish pass (make it look designed, not templated)
- Distinctive palette (drop default blue; commit to one bold accent — deep ink + electric accent + warm off-white).
- Strong display font for headings (Space Grotesk / Archivo / Inter Tight, heavy), clean body.
- Card hierarchy: top match visually elevated, FIT score as a bold ring/number, audience number as hero, accent for verified + tax.
- Hover states, subtle motion, tightened spacing. No empty voids.
- Consistent, confident, sporty energy — typographic, no stock photos.

## Build order (keep it working at each step)
1. Stand up backend + DB, seed profiles, expose GET /profiles and POST /match. Point the frontend at it (replaces hardcoded array). App still works, now data-backed.
2. Add loading states around the real calls.
3. Add LLM reasoning to /match with template fallback.
4. Add POST /profiles so the club flow writes real data.
5. (Optional) enrichment endpoint for real social counts on 1–2 profiles.
6. Deploy frontend + backend to live URLs.
7. Design polish pass.

## Hard rules
- Deterministic scoring controls RANKING; LLM only writes reasoning text. Always have a fallback so a failed/slow LLM call never breaks the demo.
- No check-in system. Data trust = public corroboration, not gate capture.
- Keep secrets server-side; never put an API key in the frontend.
- App must stay working at every step — integrate incrementally, don't rip out the working frontend.
