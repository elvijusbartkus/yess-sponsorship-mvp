# Matspo — idea + pitch handoff

A single reference doc covering the product, the business model, and the pitch, for
handing off to another agent or collaborator. Everything here is pulled from the actual
running app and its source, not invented after the fact.

- Live app: https://yess-sponsorship-mvp.vercel.app
- Repo: https://github.com/elvijusbartkus/yess-sponsorship-mvp
- Latest commit at time of writing: `41ef01c` (2026-08-15)
- Pitch deck (slides, matching the app's exact design system): `~/Desktop/Matspo-Pitch-Deck.pptx`

## 1. The idea, in one line

There's private money for sport in the Baltics. It never reaches the clubs and athletes
that need it, because there's no market connecting them. Matspo is that market: it
matches Baltic clubs and athletes with the businesses that want their audience, then
runs the campaign and proves it happened.

## 2. The problem

- Roughly €500M a year moves through Estonian sport. Business gives just €25M of that;
  grassroots sees almost none of it.
- SPLISS research: 50-65% of sporting success is bought, not trained.
- A club needs €5,000. A business has it to give. They never meet, because there's no
  place where supply and demand for sport sponsorship actually see each other.

## 3. The solution

Matspo is the market that matches them, then runs the campaign and proves it happened.
Two doors in:

- **For businesses — "Get matched."** Answer three questions about budget and audience,
  see ranked, scored matches.
- **For clubs & athletes — "Get funded."** List a profile, get found by sponsors. Not
  exclusive: keeping existing sponsors or agents is fine.

## 4. How the product actually works (current build)

1. **Sponsor quiz → matches.** A sponsor answers a short quiz (budget, audience, region,
   priorities). A deterministic matching engine scores every club/athlete profile against
   those answers (weighted: demographic fit, geography, budget fit, stated wants, priority,
   a small corroborated-data bonus) and returns ranked matches, clamped to 100.
2. **Match detail → deal room.** Sponsor opens a match, sees the case for it, can propose
   a deal (this is the point membership is asked for, not before).
3. **Deal room → contract.** Terms get agreed, a lightweight contract is signed (with a
   signing animation), deal value is recorded.
4. **Contract → the combined tracker page (this was just merged into one page).**
   Immediately after signing, one continuous page now shows:
   - **Launch kit, free, generated instantly**: auto-drafted post copy and story copy for
     the deal, in either the club's voice or the sponsor's voice, plus a plain-language
     "what to photograph" tip. No fake social-media mockup chrome, just the copy.
   - **Managed delivery, paid upsell**: a rep checks in monthly (Standard) or weekly
     (Premium) to keep the campaign on track through renewal. Priced per deal, no invented
     number shown; it's an info panel, not a checkout.
   - **Deliverables checklist**: what was promised, what's actually posted, reach logged
     per item, so there's a record that survives past a WhatsApp thread and is still there
     at renewal time.
   - This used to be two separate full-screen pages (deliverables tracker, then a
     separate "campaign" page) that a sponsor had to navigate between. Feedback on the
     pitch was that this buried the marketing feature; it's now one page.
5. **Club side, mirrored.** A club/athlete builds a profile, goes live, sponsors can find
   and contact them. The club side also sees illustrative sponsor types it could reach
   out to, scored with the same matching engine (not live leads, a starting list).

## 5. Business model

Single source of truth lives in `src/data/pricing.ts`. No promo/launch-rate exceptions;
these are the standing numbers.

| Side | Price | Free tier (always) | Paid tier unlocks |
|---|---|---|---|
| Clubs & athletes | €9.99/mo (or €49/yr) | List profile, be matched, be found and contacted | Deal support through signature, deliverables tracker & campaign drafting tools |
| Sponsors | €33.33/mo (or €249/yr) | Browse full list, run the matching quiz, unlimited re-ranking | Contact any match, deal support through signature, season reach reporting |

- **First month free, for everyone, on everything except commission** — a standing
  acquisition policy, not a time-limited launch promo. Applies identically to the 1,000th
  account as the 1st. Even deal-making in month one is free.
- **Commission: flat 2% on any closed deal, charged to the sponsor.** No size tiers, never
  discounted, nothing charged on a deal that never closes.
- The public landing page and pricing promo banner intentionally state the *policy*
  ("first month free for everyone, on everything except commission") without quoting the
  exact €9.99 / €33.33 figures, since those numbers alone read as misleadingly asymmetric
  out of context. Exact prices live only on the dedicated `/pricing` page.
- The club-side €9.99 fee is a real, working gate in the app (not just informational
  copy): deal-support/deliverables tools show locked until the club membership dialog is
  completed.

## 6. Go-to-market

Three points, stated briefly on the landing page:

1. First 1 month free for everyone, on everything except commission.
2. 2% flat commission, only on a closed deal.
3. One Committee partnership reaches every club through the Sports Register — the single
   lever that scales distribution without a cold start.

## 7. Market size

| | Value | Definition used |
|---|---|---|
| TAM | €25M | Private money into Estonian sport a year |
| SAM | €10M | The middle of the pyramid, where matching is broken |
| SOM | €80k/yr | Realistic Year 1 revenue |

## 8. Who we've talked to (problem-discovery quotes, not existing customers)

Framed deliberately as conditional ("would"), since these are conversations about the
problem, not people already using Matspo:

- **Henrikas G.**, Sporting director, FK Garliava (club side): *"There are sponsors right
  here in town who'd back us, they just don't know we exist. Something like this would
  fix that."*
- **Daniel Š.**, Lithuanian national volleyball player (athlete side): *"Some weeks I
  message sponsors more than I train. I'd use anything that saves me that time."*
- **Šarūnas J.**, Construction business owner (sponsor side): *"I'd sponsor a local club, I
  just don't know which one needs it or what I'd get back. This would make that clear."*

## 9. Team

Three people, no photos, one line each on the landing page:

- **Elvijus Bartkus — CPO.** Owns the product: the matching engine and the marketplace
  itself.
- **Markas Mejus — Marketing & Sales.** Owns getting clubs and sponsors onto the platform.
- **Faustas Razminas — CFO.** Owns the money: pricing, commission, the numbers behind it.

## 10. The ask

We're asking the Estonian Olympic Committee to put Matspo in front of every club and
athlete already in the Sports Register: one partnership, national reach, no cold start.
Not yet nailed down: the exact thing being asked of the committee (endorsement vs. intro
vs. a listed link vs. a co-pilot), a timeline, and whether anything is needed beyond the
committee (funding, pilot clubs, a warm intro).

## 11. The pitch: six slides, six timings

Slide deck file: `~/Desktop/Matspo-Pitch-Deck.pptx` (also previously published as a
web artifact matching the app's exact colors/fonts). Structure and per-slide speaking
time:

1. **Hook + problem — 30s.** Headline + subhead, then the three problem stat cards
   (§2 above).
2. **Solution — 15s.** The one-sentence solution card (§3), plus the two door cards.
3. **Demo — 60s.** Not scripted from static slide content; this is a live walkthrough.
   Suggested beats, in the app's actual screen order: sponsor quiz → ranked matches →
   deal room → contract sign → the combined launch-kit/deliverables page → club side
   publishing a profile.
   - Speech for the launch-kit/deliverables part specifically (3 sentences): *"The moment
     a deal signs, Matspo doesn't stop at the introduction. It instantly drafts the launch
     post and story for that exact sponsorship, in the club's voice or the sponsor's,
     free, and tracks what's actually been posted and its reach so there's proof for
     renewal. That's also where we make money beyond the deal itself: a managed-delivery
     upgrade where a rep keeps the campaign on track."*
4. **GTM + team — 50s.** The three GTM cards (§6) alongside the three-person team (§9).
5. **Market size + validation — 45s.** TAM/SAM/SOM (§7) alongside the "who we've talked
   to" quotes (§8) as the validation signal — there is no traction data (pilot clubs,
   signups, LOIs) beyond these conversations yet.
6. **Ask — 25s.** The Committee-partnership ask (§10), still needing the specific
   time-bound version filled in before presenting.

## 12. Known gaps / things not yet real

Listed so another agent doesn't accidentally treat them as done:

- No real payment flow anywhere (membership unlock and managed delivery are both
  info panels/dialogs, not checkouts).
- No live traction data: no pilot clubs, signups, or committee commitments exist yet
  beyond the three discovery conversations quoted in §8.
- The Ask (§10) is directionally right but not yet a specific, timed request.
- Optional Express+SQLite backend exists but the app runs fully client-side by default
  (`usingRemoteApi` gate); don't assume a real database of clubs exists in production.
