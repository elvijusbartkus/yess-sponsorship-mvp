# Two small additions: loading screen + simple data-entry (optional)

Do NOT change existing flow, logic, or data structure. These are additive polish.

## 1. Loading / "matching" screen (DO THIS — high value)

Add a short transition screen between the last quiz step and the match results. It makes the AI matching feel real and makes the product feel finished.

- Trigger: after the sponsor answers the final quiz question, show this for ~1.8 seconds, then reveal matches.
- Visual: centered, on-brand, a subtle animated spinner or progress indicator in the accent color.
- Cycle through 3 short status lines (about 0.6s each), so it feels like real computation:
  1. "Scanning Baltic clubs and athletes…"
  2. "Matching to your audience, region and budget…"
  3. "Calculating your tax position…"
- Then transition to the results screen.
- Keep it snappy — under 2 seconds total. Do not make the judge wait.

Implementation: a simple timed state (setTimeout) between quiz-complete and results. No real async needed. Pure visual.

## 2. Optional: live self-report demo for the club/athlete flow

If time allows, make the club/athlete "get discovered" flow actually add a profile to the in-memory pool, so you can demo the data entering the system live:

- Club fills a short form (name, sport, city, audience size, socials, what they offer, deal range).
- On submit: add it to the in-memory profiles array (React state), show a "You're live" preview.
- This demonstrates the self-reported data source visually. No database — just in-memory state for the session.

This is optional polish. The loading screen is the priority.

## Rules
- No backend, no database, no API. All in-memory.
- Loading screen is pure timed visual, keep under 2s.
- Do not change the matching logic or existing screens' content.
