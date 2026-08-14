import {
  ArrowRight,
  Search,
  Handshake,
  FileCheck2,
  Megaphone,
  BarChart3,
  Rocket,
  Building2,
  Trophy,
  Landmark,
} from 'lucide-react';
import { clubPlan, commission, launchPromo, membershipPlan } from '../data/pricing';

function DoorCard({
  eyebrow,
  title,
  body,
  cta,
  onClick,
  tone,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  tone: 'ink' | 'flare';
}) {
  const ink = tone === 'ink';
  return (
    <button
      onClick={onClick}
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg p-5 text-left transition-all duration-200 hover:-translate-y-1.5 sm:p-6 ${
        ink
          ? 'bg-ink-950 text-white ring-1 ring-inset ring-white/10 hover:shadow-lift'
          : 'bg-[radial-gradient(circle_at_25%_15%,theme(colors.flare.400),theme(colors.flare.600)_75%)] text-white hover:shadow-glow'
      }`}
    >
      <p className={`eyebrow ${ink ? 'text-flare-400' : 'text-white/70'}`}>{eyebrow}</p>

      <h2 className="display mt-3 text-3xl leading-[1.05] text-white sm:text-4xl">{title}</h2>

      <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-white/80">
        {body}
      </p>

      {/* The CTA says exactly what clicking it does, not a vague tagline. */}
      <span className="mt-6 inline-flex items-center gap-2 font-display text-base font-medium text-white">
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
      </span>
    </button>
  );
}

function Step({
  icon: Icon,
  label,
  body,
}: {
  icon: typeof Search;
  label: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="icon-glow h-9 w-9">
        <Icon className="h-4.5 w-4.5" strokeWidth={2.25} />
      </div>
      <div>
        <p className="font-display text-[15px] font-medium text-ink-950">{label}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-ink-500">{body}</p>
      </div>
    </div>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flare-rule h-1 w-10" />
      <p className="eyebrow text-ink-400">{children}</p>
    </div>
  );
}

function MarketStat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
      <p className="eyebrow text-ink-400">{label}</p>
      <p className="display mt-2 text-4xl leading-none tracking-tightest text-ink-950">{value}</p>
      <p className="mt-2 text-[13px] leading-snug text-ink-500">{note}</p>
    </div>
  );
}

export function Landing({
  onSponsorStart,
  onClubStart,
  onPricing,
  onBrowse,
}: {
  onSponsorStart: () => void;
  onClubStart: () => void;
  onPricing: () => void;
  onBrowse: () => void;
}) {
  return (
    <div
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:py-10"
      style={{ zoom: 1.25 }}
    >
      <div className="animate-rise max-w-3xl">
        <div className="flare-rule h-1.5 w-20" />
        <h1 className="display mt-5 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] text-ink-950">
          Money can't find sport.
          <br />
          <span className="text-flare-500">We're the market.</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-snug text-ink-500">
          We match Baltic clubs and athletes with the businesses that want their audience.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <DoorCard
          tone="ink"
          eyebrow="For businesses"
          title="Back sport"
          cta="Click here to see who reaches your customers"
          body="Answer three questions about your budget and audience."
          onClick={onSponsorStart}
        />
        <DoorCard
          tone="flare"
          eyebrow="For clubs & athletes"
          title="Get funded"
          cta="Click here to list your profile"
          body="Sponsors find you. Keep your other sponsors and agents — this isn't exclusive."
          onClick={onClubStart}
        />
      </div>

      {/* PROBLEM */}
      <section className="mt-16 border-t border-paper-line pt-14">
        <SectionEyebrow>The problem</SectionEyebrow>
        <h2 className="display mt-3 max-w-2xl text-3xl leading-[1.1] text-ink-950 sm:text-4xl">
          Private sport money never reaches the clubs and athletes that need it.
        </h2>
        <ul className="mt-6 space-y-3">
          {[
            '€500M in Estonian sport. Business gives €50M. Grassroots sees almost none.',
            'SPLISS: 50-65% of sporting success comes straight from money invested.',
            "A business wants to back sport but doesn't know which club.",
            "A club needs €5,000 but doesn't know who'd pay.",
          ].map((text) => (
            <li
              key={text}
              className="flex items-center gap-4 rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line"
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-flare-500" />
              <span className="text-xl leading-snug text-ink-800 sm:text-2xl">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-16 grid gap-6 border-t border-paper-line pt-14 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-6 ring-1 ring-inset ring-paper-line">
          <p className="eyebrow text-ink-400">How it works for sponsors</p>
          <div className="mt-5 space-y-5">
            <Step icon={Search} label="Answer a few questions" body="Budget, audience, region — three taps." />
            <Step
              icon={Handshake}
              label="Get scored, ranked matches"
              body="Real clubs and athletes, not a directory to dig through."
            />
            <Step
              icon={FileCheck2}
              label="Propose a deal, sign, track it"
              body="One dashboard for the deal, the contract, and what actually got delivered."
            />
          </div>
          <button
            onClick={onSponsorStart}
            className="mt-6 inline-flex items-center gap-1.5 font-display text-sm font-medium text-flare-600 hover:text-flare-500"
          >
            Start as a sponsor <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="rounded-lg bg-white p-6 ring-1 ring-inset ring-paper-line">
          <p className="eyebrow text-ink-400">How it works for clubs & athletes</p>
          <div className="mt-5 space-y-5">
            <Step
              icon={Search}
              label="Build your profile"
              body="Eight quick questions — no exclusivity, keep your other sponsors and agents."
            />
            <Step
              icon={Handshake}
              label="Sponsors find you"
              body="See exactly which kinds of businesses would want you."
            />
            <Step
              icon={FileCheck2}
              label="Keep the full deal"
              body="Commission is charged to the sponsor, on top — never out of your side."
            />
          </div>
          <button
            onClick={onClubStart}
            className="mt-6 inline-flex items-center gap-1.5 font-display text-sm font-medium text-flare-600 hover:text-flare-500"
          >
            Start as a club or athlete <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {/* THE MARKETING / JUSTIFICATION LAYER — the core differentiator */}
      <section className="mt-16 overflow-hidden rounded-xl bg-ink-950 p-6 text-white ring-hairline-dark sm:p-8">
        <div className="flare-rule h-1.5 w-10" />
        <p className="eyebrow mt-3 text-flare-400">Why we're not just a directory</p>
        <h2 className="display mt-2.5 max-w-2xl text-2xl leading-[1.1] text-white sm:text-3xl">
          We don't just introduce you. We run the marketing and prove it happened.
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="flex items-start gap-3.5">
            <div className="icon-glow-dark h-9 w-9">
              <Megaphone className="h-4.5 w-4.5" strokeWidth={2.25} />
            </div>
            <div>
              <p className="font-display text-[15px] font-medium text-white">We draft the campaign</p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/80">
                A launch post and story caption get generated for every signed deal — clubs and
                athletes are training, not marketers.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="icon-glow-dark h-9 w-9">
              <FileCheck2 className="h-4.5 w-4.5" strokeWidth={2.25} />
            </div>
            <div>
              <p className="font-display text-[15px] font-medium text-white">
                We prove it, deliverable by deliverable
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/80">
                Every activation item is tracked — posted or not, reach logged — a real record to
                justify the spend and renew against, instead of a deal that quietly lapses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO ARE OUR USERS */}
      <section className="mt-16 border-t border-paper-line pt-14">
        <SectionEyebrow>Who we're building for</SectionEyebrow>
        <h2 className="display mt-3 max-w-2xl text-2xl leading-[1.1] text-ink-950 sm:text-3xl">
          Three sides. One broken market.
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="group rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
            <div className="icon-glow h-10 w-10">
              <Trophy className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <p className="mt-3 font-display text-lg font-medium text-ink-950">Clubs & athletes</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-700">
              2,900+ registered clubs, 240,000+ participants. Need money.
            </p>
          </div>
          <div className="group rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
            <div className="icon-glow h-10 w-10">
              <Building2 className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <p className="mt-3 font-display text-lg font-medium text-ink-950">Businesses</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-700">
              Thousands of local firms, €500–50k to spend, no one to spend it on.
            </p>
          </div>
          <div className="group rounded-lg bg-ink-950 p-5 ring-hairline-dark transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:col-span-3 sm:flex sm:items-center sm:gap-6">
            <div className="icon-glow-dark h-10 w-10">
              <Landmark className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div className="sm:flex-1">
              <p className="mt-3 font-display text-lg font-medium text-white sm:mt-0">The Committee</p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/80">
                Already centralizes every club via the Sports Register. One lever to onboard all of
                them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARKET SIZE + GO-TO-MARKET, side by side to keep the page shorter */}
      <section className="mt-16 grid gap-8 border-t border-paper-line pt-14 sm:grid-cols-2">
        <div>
          <SectionEyebrow>Market size</SectionEyebrow>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <MarketStat label="TAM" value="€25M" note="Private money into Estonian sport a year." />
            <MarketStat
              label="SAM"
              value="€8M"
              note="The middle of the pyramid, where matching is broken."
            />
            <MarketStat label="SOM" value="€47k/yr" note="Realistic Year 1 revenue." />
          </div>
        </div>
        <div>
          <SectionEyebrow>Go-to-market</SectionEyebrow>
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-2.5 rounded-lg bg-white p-3.5 ring-1 ring-inset ring-paper-line">
              <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-flare-500" />
              <p className="text-[13px] leading-relaxed text-ink-700">
                Clubs free first {launchPromo.clubFreeMonths} month, sponsors free first{' '}
                {launchPromo.sponsorFreeMonths} months at {Math.round(launchPromo.commissionRate * 100)}%
                commission — then {clubPlan.currency}
                {clubPlan.priceMonthly}/{membershipPlan.currency}
                {membershipPlan.priceMonthly} per month and {Math.round(commission.standard * 100)}%
                flat.
              </p>
            </div>
            <div className="flex items-start gap-2.5 rounded-lg bg-white p-3.5 ring-1 ring-inset ring-paper-line">
              <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-flare-500" />
              <p className="text-[13px] leading-relaxed text-ink-700">
                Estonia first, then Lithuania and Latvia — using Lithuania's 200% tax deduction as
                the wedge for the second run.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-paper-line pt-6">
        <button
          onClick={onPricing}
          className="font-display text-[15px] font-medium text-ink-500 transition-colors hover:text-flare-500"
        >
          Clubs {clubPlan.currency}
          {clubPlan.priceMonthly}/mo · Sponsors {membershipPlan.currency}
          {membershipPlan.priceMonthly}/mo{launchPromo.active ? ' · launch offer live' : ''} →
        </button>
        <button
          onClick={onBrowse}
          className="font-display text-[15px] font-medium text-ink-500 transition-colors hover:text-flare-500"
        >
          Just browsing? See every club & athlete →
        </button>
      </div>
    </div>
  );
}
