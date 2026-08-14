# Sport Sponsorship Marketplace — Master Document (v2)

*Estonian Olympic Committee (EOK) x YESS Hackathon, Tallinn, August 2026*

*This version integrates the Baltic market research: real funding figures, the competitive landscape (Sponsoo and others), the tax-optimization engine, and the GDPR-compliant trust layer. It is the proof-of-depth behind a short stage pitch, not the stage pitch itself.*

---

## 0. One-line version

**A two-sided AI marketplace that matches sport (clubs and athletes) with money (sponsors), and makes each match tax-optimized, so private capital finally flows to the 99% of Baltic sport that sponsors today cannot find, value, or fund.**

We take a commission only when a deal closes: 2% on large deals, 10% on small deals. Nobody pays to join. We earn when we create value. Our wedge over existing marketplaces is that we do not just match audiences, we match the best tax treatment, turning sponsorship from charity into a financial instrument.

---

## 1. The problem

### 1.1 The headline, now backed by numbers

Baltic sport runs on public money and a handful of elite deals, while private corporate capital for the middle and lower tiers is close to nonexistent. This is not a hunch; the data is stark.

- Estonia's state Sports Programme is roughly €46 million, and €43 million of that goes to top-tier and elite sport, with only about €3 million to grassroots activity. Public money flows to the extremes, not the middle.
- Estonian tax law lets companies donate up to about €1 billion a year tax-free. In 2022, corporations actually donated only about €4 million to culture and sport, and only about 0.5% of Estonian companies use the mechanism at all. The private capital exists as legal headroom; almost none of it moves.
- Latvia spends about €34 per capita on sport, near the bottom of the EU (average about €130), placing an enormous theoretical burden on private sponsors that current infrastructure cannot carry.
- Lithuania has the most active commercial market, but it is concentrated at the elite basketball top. BC Žalgiris Kaunas alone ran a 2025-26 budget of about €21.7 million. That single club's budget dwarfs the entire national corporate donation output of Estonia.

The pattern across all three countries is the same: money pools at the very top and at the public base, and the vast middle of the pyramid is starved.

### 1.2 Why the money does not flow

The Estonian Foresight Centre confirms that sport and culture organizations lack the skills, habits, and tools to collect donations or secure sponsorship. The failure happens at three points in the transaction.

**Discovery is broken.** A local business with a €2,000 budget wanting to reach youth in a specific county has no directory, no search, no matching. Deals happen through personal networks and luck. A club's funding is capped by the social circle of its board.

**Value is unprovable.** Small clubs rely on self-reported attendance that sponsors cannot verify. A decision that should be a simple cost-per-impression calculation becomes a leap of faith, and risk-averse SMEs walk away.

**The market is fragmented across three jurisdictions.** A brand wanting Baltic-wide grassroots exposure would have to find, negotiate with, and audit hundreds of micro-clubs across three legal and tax systems. The transaction cost exceeds the sponsorship value, so nobody does it.

### 1.3 The core insight

Sport does not lack attention; it lacks a market. The audiences exist all across the pyramid. What does not exist is the infrastructure to discover, value, and buy that attention, and to do so in a way that is financially rational for the sponsor. Build that market, make it tax-smart, and the €1 billion of unused legal headroom starts to move.

---

## 2. The solution

### 2.1 What it is

A multi-sided marketplace for Baltic sport sponsorship. On one side, clubs and athletes with audiences to offer. On the other, sponsors and businesses with money to spend and tax to optimize. In the middle, AI matching that connects the right supply to the right demand on audience, budget, region, goals, and, crucially, tax efficiency.

### 2.2 The three sides

- **Supply (sport):** clubs and athletes create free profiles describing audience, reach, results, region, and what a sponsor gets. Modeled on how Sponsoo structures a real sponsorship profile (audience size, social reach, press mentions, achievements, activation options, current sponsors).
- **Demand (money):** sponsors describe budget, target audience, region, and goals via a quick quiz funnel.
- **The match:** AI surfaces the strongest fits with a clear reason for each, and a tax-benefit headline for each.

The Olympic Committee and TV sit at the edges as reach amplifiers and, critically, as the lever that can onboard the entire supply side at once.

### 2.3 How a deal happens

1. A sponsor completes the quiz funnel: budget, audience, region, goal.
2. Clubs and athletes already have free profiles with audience and reach data.
3. The AI matches the sponsor to the best-fitting profiles, explains why each fits, and shows the tax benefit of each.
4. The sponsor reviews, sees both audience value and financial value, and connects.
5. A deal closes. The platform takes its commission and generates the tax-compliance documentation.

### 2.4 Why a marketplace and not a tool

A single tool solves one narrow problem for one party. A marketplace solves discovery, valuation, and matching for everyone and compounds through network effects: every sponsor makes the platform more valuable to clubs, and every club more valuable to sponsors. That network effect is the moat.

---

## 3. The AI matching layer

### 3.1 What it does

The engine takes structured inputs from both sides and returns ranked matches with explanations and a tax benefit.

For a sponsor: budget, target demographic, geographic focus, campaign goal.
For a club or athlete: audience size, demographics, geographic base, channel reach, results, activation options, and tax status.

It matches on fit across these dimensions, explains each match in plain language, and computes the financial upside of each.

### 3.2 Why explanations matter

A match with no reason is a guess. A match with a data-grounded reason and a euro figure of tax saving is a recommendation a sponsor can act on and justify internally. The explanation and the tax number are what turn the AI from a black box into a broker the sponsor trusts.

### 3.3 The data problem, stated honestly

Matching is only as good as its data, and at the start, club data is self-reported. This is the "lemon problem": if sponsors cannot verify attendance, they assume it is inflated and pay less, which erodes trust in the whole platform. This is the single most important thing to solve for credibility, and it is addressed by the trust layer in section 5.

---

## 4. The tax engine (the differentiator)

### 4.1 Why this is the wedge

The closest real competitor, Sponsoo (Germany), already proves the two-sided commission-on-close marketplace works. It is not in the Baltics and it does not optimize for tax. That is our opening. We do not just tell a sponsor "this club reaches your audience." We tell them "this sponsorship also cuts your tax bill by this much." That reframes sponsorship from a philanthropic nice-to-have into a rational financial instrument, which is exactly what unlocks the risk-averse SME money that sits on the sidelines today.

### 4.2 The three tax realities the engine encodes

- **Lithuania, the catalyst.** A company sponsoring a club that holds official sponsorship-recipient status can deduct 200% of the sponsored amount from taxable profit (up to 40% of taxable profit). A €1,000 sponsorship deducts €2,000. The engine flags clubs with this status because sponsors will actively filter for that 200% return.
- **Estonia, underutilized capacity.** Companies can donate up to 3% of paid wages or 10% of prior-year profit tax-free, but only about 0.5% of companies use it. The engine's job here is education: automatically generate the compliance documentation so an SME can claim the deduction seamlessly on executing a match.
- **Latvia, the cautious case.** Recent corporate tax reforms suppressed donation incentives. Here the engine cannot lean on deductions; it positions sponsorship strictly as an efficient, data-driven B2B advertising expense. The platform must be honest per country rather than pretending a benefit exists.

### 4.3 What the tax engine does in the product

For every match, it computes the deductible amount from the sponsor's budget and the club's tax status, and surfaces a headline: "Your €1,000 sponsorship deducts €2,000 from taxable profit" (LT), or "Fully tax-free under Estonia's donation allowance" (EE). On a closed deal, it generates the compliance paperwork. This is a headline feature, not a footnote.

---

## 5. The trust layer (verified audience data, GDPR-solved)

### 5.1 The gap

Self-reported audience data is the fuel for matching and its biggest credibility risk. Sponsors will not keep paying for matches built on numbers they cannot trust.

### 5.2 The answer

A lightweight check-in at events: fans authenticate their attendance (scan, quick verification, small incentive), producing real, verified attendance and demographic data rather than a club's estimate. This verified data becomes the number the AI matches on and the sponsor sees. This is where the original check-in concept finds its correct home: not a product sold to clubs, but the integrity layer under the marketplace.

### 5.3 GDPR, solved by design

The research resolved the privacy question. Sponsors do not need individual identities; they need aggregated, anonymized cohorts ("500 verified attendees, 65% female, aged 25-40"). By hashing check-ins into anonymized statistical pools, the platform delivers sponsor-grade evidence of audience without transferring any personal data to the sponsor, neutralizing the main GDPR liability through data minimization.

### 5.4 Why it is a roadmap item, not day one

For an early version and the hackathon demo, profiles start with self-reported and public data, with verified data introduced as the trust upgrade over time. The platform works as a marketplace immediately; verification makes it progressively more credible. In the demo this is shown as a "Verified audience" badge on some profiles and not others, so the trust concept is visible without building the check-in system yet.

### 5.5 What verification unlocks

Verified data lets sponsors trust the match and pay full value, lets clubs charge what they are worth, makes the AI matching materially better, and, over time, becomes a proprietary dataset no competitor starting from scratch can replicate. It turns the platform from a directory into an audited data broker.

---

## 6. Monetization

### 6.1 The model

Commission on closed deals. Nobody pays to join, list, or browse. The platform earns only when it produces a deal.

- **2% on large deals.** Big absolute value, so a thin rate still earns well, and a low rate discourages sponsors from going offline to avoid the fee.
- **10% on small deals.** A higher rate makes high-volume, low-value local deals profitable to process, and the absolute amounts are small enough that sponsors accept it easily.
- **Performance upside.** Deals with measurable outcomes (reach, engagement via the trust layer) can carry a performance component, aligning the platform with sponsor results.

The research explicitly endorses this exact tiering: 10% makes small local deals viable, 2% on big deals discourages leakage.

### 6.2 Why commission-on-close is right

It removes all friction to joining (solving cold-start on both sides), aligns incentives (the platform only wins when both sides win), scales with value, and entirely sidesteps the "clubs are too poor to pay" problem because clubs never pay upfront. This is the model Sponsoo used to accumulate 9.5 million represented club members in Germany. SaaS-fee models for grassroots (EngageRM, PledgeIt, OpenSponsorship's subscription) fail or exclude the lower tiers precisely because cash-poor clubs churn off fixed fees.

### 6.3 Who pays

The commission comes off the deal, effectively from the sponsor's spend. The party with money pays; the party seeking money does not pay upfront; payment happens only when value is created.

### 6.4 Secondary revenue (later, only after liquidity)

Premium sponsor accounts, priority matching, and paid access to aggregated anonymized audience insights. Deliberately secondary. Do not monetize secondary lines before the marketplace has liquidity.

---

## 7. Cold start and liquidity

### 7.1 The hardest problem

An empty marketplace is worthless; each side needs the other. This kills most marketplaces and must be solved deliberately.

### 7.2 Onboarding mechanics

- **Sponsors** enter through a quiz funnel that onboards them and instantly shows matched, tax-optimized opportunities. Low friction, instant payoff.
- **Clubs and athletes** self-serve free profiles. The incentive is obvious: exposure to sponsors they could never reach otherwise.

### 7.3 Sequencing

Seed supply first (clubs have nothing to lose by listing), bring demand once supply is worth browsing, and do not monetize until deals actually happen.

### 7.4 The Olympic Committee as accelerant

This is the decisive lever. Baltic sport governance is highly centralized: power sits with the Olympic Committees and national federations, and compliance is enforced through registers like the Estonian Sports Register. If a governing body endorses or mandates the marketplace for its clubs, the platform captures the entire supply side at once, without spending on user acquisition. This mirrors how Denmark's LigaLogin achieved penetration through federation mandate rather than commercial appeal. The committee is not the customer; it is the fastest path to liquidity.

---

## 8. Market and scale

### 8.1 Start in Estonia

Estonia is the entry point, driven by the Olympic Committee context. Prove the model: real clubs and athletes, real local and national sponsors, real matched and tax-optimized deals. Supply-side scale is real: Estonia has roughly 2,700-2,800 registered organizations and over 240,000 participants, with 7% year-over-year participant growth in 2024.

### 8.2 Expand across the Baltics

The same failure exists identically in Latvia (over 120,000 participants under 94 federations) and Lithuania. The same platform extends with almost no change. Three small markets combined are a meaningfully larger one.

### 8.3 The cross-market prize

The endgame is one Baltic marketplace where a single brand backs sport across all three countries at once: a Lithuanian brand funding a Latvian hockey team and an Estonian track athlete in one unified, tax-optimized campaign. No single-country solution and no offline agency can offer that. This is the scale story that makes the platform more than a small local tool, and the tax engine is what makes it coherent across three different tax regimes.

### 8.4 Beyond football, beyond the Baltics

The model is sport-agnostic and generalizes across the region. Football is the natural beachhead for its club count and audience clarity.

---

## 9. Competitive landscape

### 9.1 The validating competitor: Sponsoo (Germany)

Sponsoo is Europe's largest sports sponsorship marketplace: two-sided, all tiers from Olympians to grassroots, 300+ sports, over 9.5 million represented club members, free for supply, monetized purely by commission on closed deals. It proves our exact model works at scale. But it lacks Baltic Olympic Committee integration and local tax-deduction workflows. The model is proven; the Baltic space and the tax layer are open.

### 9.2 The US influencer model: OpenSponsorship

25,000+ athletes, 150 sports, but tailored to individual influencers (NBA, NFL, NCAA NIL), and it charges brands a $129-$499/month subscription plus fees with $1,000+ minimums. That subscription-plus-minimum model excludes exactly the small Baltic businesses we target. A cautionary example, not a fit for this market.

### 9.3 Enterprise fan platforms: Blocksport, Fanbaseclub, SportAdmin

White-labeled apps, tokenization, membership, and association CRM for the top of the pyramid or for internal administration. They help big clubs monetize existing fans; none is a two-sided sponsor-discovery marketplace. They serve the top 1%; they do not touch the middle and bottom.

### 9.4 Ticketing incumbents: the Piletilevi Group (PLG)

PLG (Piletilevi, Piletitasku, Bilietai, Kakava, TicketBest) consolidates Baltic ticketing and owns vast buyer data, but operates strictly as a consumer ticket-transaction engine, not a B2B sponsorship matcher. Note their power has regulatory limits: in 2025 the Lithuanian Competition Council blocked PLG's attempted acquisition of Tiketa. They are adjacent data incumbents, not direct competitors.

### 9.5 Single-sided tools: PledgeIt, MatchKit

Athlete crowdfunding and profile tools with high flat fees ($150/month) and, critically, single-sided: the athlete must drive their own sponsor traffic. They do not aggregate corporate demand, so they never solve discovery.

### 9.6 Why the space is open and why competition is good

The enterprise players serve the top, the ticketing players serve transactions, the offline agencies serve whoever has connections, and single-sided tools do not solve discovery. The middle and bottom of the Baltic pyramid, thousands of clubs and hundreds of thousands of participants, are served by nobody. A funded market leader (Sponsoo) existing elsewhere proves the model and the money are real; its absence here is the opening. The moat is the two-sided network plus the verified dataset plus the tax-workflow integration, none of which a copycat starting from zero has.

---

## 10. Risks and honest weaknesses

### 10.1 Corporate apathy toward grassroots (the real one)

The strongest evidence against viability is behavioral: only €4 million of a roughly €1 billion tax-free allowance is used in Estonia. A skeptic reads this as businesses not wanting to fund grassroots. Our answer is the tax engine and verified ROI: we do not ask for charity, we offer a 200% deduction (LT) or a tax-free, documented, measurable B2B ad spend (EE). We change the reason for the transaction from goodwill to profit. This is the one hard question, and the tax reframe is the answer.

### 10.2 Cold start

If both sides do not populate, nothing matches. Mitigation: seed supply first, use the Olympic Committee to onboard supply en masse, do not monetize before liquidity.

### 10.3 Data trust (the lemon problem)

Unverified numbers erode trust and depress price. Mitigation: the phased, GDPR-compliant check-in trust layer, which the research calls non-negotiable for long-term survival.

### 10.4 Market ceiling

Even full penetration in Estonia is capped by 1.36 million people. Mitigation: Baltic-wide from inception, plus the cross-market campaign product only a regional platform can offer, plus expansion across sports.

### 10.5 Willingness to pay (the donation fallacy)

The committee's own research shows fan willingness to make voluntary contributions trends near zero. Mitigation: no B2C crowdfunding, ever. Revenue is purely B2B (businesses paying for audience and tax efficiency), a proven ROI behavior, not a charitable one.

### 10.6 Deal leakage (disintermediation)

Matched parties may close offline to dodge the commission. Mitigation: keep post-match value inside the platform that exceeds the fee, specifically the tax-compliance documentation (LT 200% paperwork, EE tax-free filings) and ongoing ROI reporting via the trust layer, plus the low 2% rate on big deals that makes leaving not worth it.

### 10.7 Dependence on the Olympic Committee

A powerful accelerant but not guaranteed. Mitigation: the platform works without an exclusive committee deal (direct sign-up is possible), and there are three federations and committees across the Baltics, not one.

---

## 11. Fit with the Olympic Committee brief

The brief asks how Estonia can use its sports resources more intelligently to create greater sporting, social, and economic value, and specifically how to bring more private capital into sport.

- **More private capital into sport:** the platform exists to move the unused €1 billion of tax-free corporate headroom into clubs and athletes that cannot access it today.
- **An athlete's value made clearer to a sponsor:** profiles plus verified data make value explicit, comparable, and priced.
- **Many smaller contributions instead of a few large sponsors:** efficient discovery and 10%-viable small deals let many local SMEs back many small clubs, the exact distributed-funding model the brief wants.
- **The right partners finding one another:** literally what the AI matching does.
- **One meaningful problem, not all of sport:** the platform picks one, the broken market between sport and sponsors, and solves it deeply.
- **Economic value:** every €1 into sport is estimated to return about €1.40 to GDP, aligning the platform directly with state interests and opening federation integration.

---

## 12. The MVP and demo scope

### 12.1 What to build

Not the whole marketplace. Build the sponsor-side match flow: a sponsor completes the quiz, the AI returns matched clubs and athletes each with a reason AND a tax-benefit headline, and the sponsor can view a match and connect.

### 12.2 Why the sponsor side is the hero

The sponsor is the money, and the judges are themselves sponsors and brands. Showing their view puts them in the buyer's seat: they answer a short funnel and instantly see relevant, explained, tax-optimized opportunities. Most persuasive possible demo for that room.

### 12.3 What stays vision, not built

The full multi-sided marketplace (vision slide), the check-in trust layer (named, shown as a verified badge), Baltic expansion and the cross-market product (scale story), the compliance-document generation and secondary revenue (mentioned).

### 12.4 The demo narrative

Open on the problem: €1 billion of tax-free money sits unused because sport and sponsors cannot find each other. Show the sponsor completing the funnel. Show the AI returning explained, tax-optimized matches, with a verified-audience badge on some. Land on the star match: a Lithuanian club whose 200% status turns a €1,000 sponsorship into a €2,000 deduction, connected to a sponsor that would never have found it. Then one slide on the model (commission on close), one on scale (Baltic marketplace), one line on the trust roadmap (verified data).

---

## 13. The pitch structure (for the stage)

1. **Hook.** Estonia lets companies give €1 billion a year to sport tax-free. They use €4 million. Why does 99% of the money stay on the table?
2. **Problem.** Because sport and sponsors cannot find each other, value cannot be proven, and the market is fragmented across three countries.
3. **Solution.** An AI marketplace matching clubs and athletes with sponsors, and optimizing every match for tax so sponsorship becomes a financial instrument, not charity.
4. **Demo.** Sponsor completes the funnel, instantly sees explained, tax-optimized, verified matches. Land on the 200% deduction match.
5. **Model.** Commission on closed deals, 2% large, 10% small. Nobody pays to join; we earn when we create value. Proven by Sponsoo in Germany.
6. **Scale.** Estonia first, then a Baltic-wide, tax-optimized sponsorship marketplace no single-country or offline player can match.
7. **Trust roadmap (one line).** GDPR-compliant check-in turns self-reported numbers into anonymized, sponsor-grade evidence.
8. **Close.** This is how the unused billion finally reaches all of Baltic sport, not just the top.

Keep money to one slide and architecture to zero. This document is the depth behind that pitch.

---

## 14. Open questions to resolve

- **Name.** Short, memorable, works across the Baltics.
- **Seed supply.** The first 6-8 concrete club/athlete profiles (real names, cities, plausible numbers, tax status), including at least one LT club with 200% status as the demo star.
- **Sponsor personas.** 2-3 example sponsors (a local Tartu gym at €2,000; a national bank at €20,000) for contrasting demo runs; the committee's own partner brands are natural references.
- **Take-rate validation.** 2%/10% is research-endorsed but should be confirmed in the pilot.
- **Trust-layer sequencing.** When verified check-in data is introduced and for which clubs first.
- **Committee relationship.** Endorsement, partnership, or mandate; this determines how fast cold-start is solved.

---

## 15. Summary

Baltic sport has attention but no market to sell it, and roughly €1 billion of tax-free corporate capacity in Estonia alone sits unused because clubs cannot be found or valued and sponsors have no efficient, financially rational way to fund them. The solution is a two-sided AI marketplace that matches sport with sponsors and optimizes every match for tax, monetized by commission on closed deals so nobody pays to join and the platform earns only when it creates value. The model is proven by Sponsoo in Germany and left wide open in the Baltics, where no player combines two-sided matching, the verified trust layer, and tax-workflow integration. Cold-start is solved by seeding supply, onboarding sponsors through a quiz funnel, and using the Olympic Committee's governance authority as the accelerant. The credibility problem is solved by a GDPR-compliant check-in trust layer that turns self-reported claims into anonymized, sponsor-grade evidence. The scale story is a Baltic-wide, tax-optimized marketplace no single-country or offline player can match. For the hackathon, the demo is the sponsor-side match flow with the tax engine front and center, the most persuasive slice for a room full of sponsors, with the full marketplace, the trust layer, and Baltic scale shown as the vision behind it.

This directly answers the Olympic Committee's central question, how to bring more private capital into sport, by building the tax-smart market that sport is missing.
