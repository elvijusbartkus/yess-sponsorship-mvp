# Build Spec v3 — the real product, rebuilt

Read `marketplace_master_v2.md` for full context. This document overrides the earlier build notes. Build this as a real, polished website, not a rough demo. Clean, modern, product-grade. Two full flows.

## What this is

A two-sided marketplace that brings private money into sport by connecting clubs and athletes (who need funding) with sponsors and businesses (who have money and want audience). AI matches the two sides on audience, region, budget and goals. Tax efficiency is ONE helpful feature among several, not the whole story. The core story is: private capital that today cannot find its way into sport, now flows, because discovery, valuation and matching finally exist.

Do not over-index on tax. Tax is a supporting benefit shown on a match, not the headline of the whole product.

## The core message (get this right everywhere)

Sport has audiences but no market to sell them. Local and national businesses have money and want local audiences but cannot find, evaluate or back the right club or athlete. We are the marketplace that connects them, so private money finally flows into the middle and lower tiers of sport that sponsors today ignore. That is the product. Tax is one reason a sponsor says yes, not the reason the product exists.

## TWO FULL FLOWS — both must be real

The landing page has two equally prominent entry points. Both lead to real, working flows.

### Flow A — Sponsor ("I want to back sport")
1. Short guided quiz (see questions below).
2. AI returns ranked matches: clubs and athletes that fit their audience, region, budget and goal.
3. Each match shows: fit score, audience (with verified badge where applicable), what the sponsor gets, typical deal range, and a clear value summary. Tax benefit appears as one line where it applies, not as the dominant element.
4. Match detail page: full profile, why matched, what you get, audience breakdown, deal range, connect button.
5. Connect → "Request sent" confirmation.

### Flow B — Club / Athlete ("I want funding")
1. Short guided profile builder: name, sport, type (club/athlete), country/region, audience size, audience channels (attendance, social), what they can offer a sponsor (activation), typical deal range.
2. On completion: a live profile preview showing how sponsors will see them, plus "You're live — sponsors can now discover and back you."
3. Optional: a simple view of how many/what kind of sponsors are currently searching (can be illustrative), to show the demand side is real.

Both flows must be genuinely navigable. This is a real website with two doors, not a single demo path with a fake second button.

## Design direction — must look clean and real

- Modern, minimal, trustworthy SaaS/marketplace aesthetic. Think a real funded startup landing + app, not a hackathon prototype.
- One confident primary accent color, generous whitespace, clear type hierarchy, consistent spacing, rounded cards, subtle shadows and borders. No clutter.
- Landing: clear headline about private money flowing into sport, one short subline, the two CTAs (sponsor / club-athlete) side by side, and a light strip of "sample sponsor" and "sample club" quick-starts for the demo.
- App screens: calm, spacious, readable. Match cards are clean with a clear hierarchy (name → sport/region → audience → fit → value line → CTA). Do not cram every data point onto the card; put depth on the detail page.
- Mobile-friendly and projector-friendly (it will be shown on a screen to a room).
- Real, consistent copy. No placeholder lorem, no contradictory or repeated text across cards.

## Quiz questions (sponsor flow) — 5, sharp, tappable

1. **Where does your business operate?** Estonia / Latvia / Lithuania. (Determines any tax context and local relevance.)
2. **What's your budget for this sponsorship?** €500–2k / €2k–10k / €10k–50k / €50k+.
3. **Who are you trying to reach?** Youth / 18–34 / 35–54 / Families / Broad audience.
4. **Where do you want to be visible?** A specific city / Nationally.
5. **What's the goal?** Brand awareness / Local presence / Youth engagement / National reach.

Optional 6th if it strengthens the demo: **What matters most in who you back?** Biggest verified audience / Best value for money / Strongest local story. Use it to re-weight the ranking so the AI visibly responds.

## Profile builder (club/athlete flow) — keep it short

Name, club-or-athlete, sport, country + region, estimated audience size, social reach (optional), what you offer sponsors (multi-select: kit branding, venue banners, social posts, named event, newsletter, hospitality), typical deal range. End on a live profile preview.

## Matching logic — must actually work

Score each club/athlete against the sponsor's answers, 0–100, sort, show top matches. Weak matches must rank LOW.

- **Demographic fit** (heavy): full if the profile's audience includes the target demographic; partial for genuinely adjacent (families↔youth); low if no overlap. A youth club in a 35–54 search must score low, not high.
- **Region fit** (heavy): full if region matches; national profiles get partial for any city.
- **Budget fit** (medium): full if the sponsor budget overlaps the profile's typical deal range.
- **Goal fit** (medium): youth-engagement favors youth profiles; national-reach favors national/high-reach; local-presence favors city-specific; brand-awareness favors highest reach.
- **Verified bonus** (small): profiles with verified audience rank slightly higher (trust).

The reasons shown on each match MUST reflect that specific profile's actual top-scoring factors. No identical reason text repeated across every card. If a match is adjacent/weak, say so honestly and rank it lower. The fit %, the tags, and the reason must all agree with each other and with the sponsor's query.

## Value shown per match (private-money framing first, tax second)

Lead with the sponsorship VALUE, then tax as a secondary line:
- Audience reached (with verified badge where real).
- What the sponsor gets (activation).
- Typical deal range.
- One tax line, only where it genuinely applies:
  - Lithuania, qualifying club: "Enhanced tax relief available (up to 200% deduction)." Compute honestly if you show euros.
  - Estonia, registered recipient: "Eligible under Estonia's tax-free donation allowance."
  - No qualifying status: omit the tax line or say "priced as standard marketing spend." Never fake a saving on a non-qualifying profile.

Keep tax to one restrained line. The hero of each match is the audience and the fit, not the tax number.

## Tax math (only where shown, must be honest)

```
// Lithuania, qualifying club (200% deduction), corp tax ~16%
deduction = amount * 2.0
taxSaved  = deduction * 0.16      // ≈ amount * 0.32
realCost  = amount - taxSaved

// Estonia, registered recipient (tax-free allowance), avoids ~22% distribution tax
taxSaved  = amount * 0.22         // approximate
realCost  = amount - taxSaved

// No qualifying status
taxSaved  = 0
realCost  = amount
```
Never display a saving for a profile with taxSaved = 0. Different profiles show different, correct numbers. Verify rates before quoting exact euros on stage.

## Commission model — correct copy

Free to join, free to browse, free to connect. The platform earns a commission ONLY when a sponsorship deal closes: 2% on large deals, 10% on small deals. Never say we charge to contact. Copy: "Free to connect. We only earn when a deal closes — 2% on large deals, 10% on small."

## Tech

- React + Vite + TypeScript, Tailwind. All client-side, in-memory state, no backend.
- Hardcoded profile data (6–8 Baltic clubs/athletes, mixed country/region/demographic/verified/deal-range/tax-status).
- Deterministic scoring function presented as AI matching. No live API on stage.
- Two flows via a simple router/state machine: landing → (sponsor quiz → matches → detail → connect) or (club builder → live preview).

## Build order

1. Data (profiles) + types.
2. Matching function (test in isolation, confirm weak matches rank low).
3. Landing with two CTAs.
4. Sponsor flow: quiz → matches → detail → connect.
5. Club/athlete flow: builder → live preview.
6. Styling polish pass to make it look like a real product.
7. Record a screen capture of both flows as a demo fallback.

## Do NOT

- Do not make tax the headline of the product; private money into sport is the headline.
- Do not show only one entry path; both flows must exist and be navigable.
- Do not repeat identical reason/tax text across cards.
- Do not show contradictory data (query vs score vs tags vs reason must agree).
- Do not say we charge to contact.
- Do not leave it looking like a rough demo; it must read as a real, polished website.
