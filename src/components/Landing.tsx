import {
  ArrowRight,
  Search,
  Handshake,
  FileCheck2,
  AlertTriangle,
  Megaphone,
  BarChart3,
  Rocket,
  Building2,
  Trophy,
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
        ink ? 'bg-ink-950 text-white hover:shadow-lift' : 'bg-flare-500 text-white hover:shadow-flare'
      }`}
    >
      <p className={`eyebrow ${ink ? 'text-flare-400' : 'text-white/70'}`}>{eyebrow}</p>

      <h2 className="display mt-3 text-3xl leading-[1.05] text-white sm:text-4xl">{title}</h2>

      <p className={`mt-2.5 flex-1 text-[15px] leading-relaxed ${ink ? 'text-ink-300' : 'text-white/80'}`}>
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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-paper-dim text-ink-950">
        <Icon className="h-4.5 w-4.5" />
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
    <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
      <p className="eyebrow text-ink-400">{label}</p>
      <p className="display mt-2 text-4xl leading-none text-ink-950">{value}</p>
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
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:py-10">
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
      <section className="mt-12 border-t border-paper-line pt-10">
        <SectionEyebrow>The problem</SectionEyebrow>
        <h2 className="display mt-4 max-w-2xl text-3xl leading-[1.05] text-ink-950 sm:text-4xl">
          Sport has an audience. It has no market.
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: AlertTriangle,
              text: 'Local clubs and individual athletes reach real, loyal audiences — but have no way to package or price that reach for a business.',
            },
            {
              icon: AlertTriangle,
              text: "Sponsors who'd back them can't find them, can't evaluate the numbers, and can't trust a self-reported claim over a coffee chat.",
            },
            {
              icon: AlertTriangle,
              text: "When a deal does happen, it's a handshake and a WhatsApp thread — no contract, no proof anything was delivered.",
            },
            {
              icon: AlertTriangle,
              text: "Money that would go to grassroots sport goes to ad platforms instead, because ad platforms are easier to buy from.",
            },
          ].map((item) => (
            <li key={item.text} className="flex items-start gap-3 rounded-lg bg-white p-4 ring-1 ring-inset ring-paper-line">
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-flare-500" />
              <span className="text-[14px] leading-relaxed text-ink-700">{item.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-12 grid gap-8 border-t border-paper-line pt-10 sm:grid-cols-2">
        <div>
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
        <div>
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
      <section className="mt-12 overflow-hidden rounded-lg bg-ink-950 p-6 text-white sm:p-8">
        <div className="flare-rule h-1.5 w-10" />
        <p className="eyebrow mt-4 text-flare-400">Why we're not just a directory</p>
        <h2 className="display mt-3 max-w-2xl text-3xl leading-[1.05] text-white sm:text-4xl">
          We don't just introduce you. We run the marketing and prove it happened.
        </h2>
        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-flare-400">
              <Megaphone className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-display text-[15px] font-medium text-white">We draft the campaign</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-300">
                Clubs and athletes are training, not marketers. A launch post and story caption get
                generated for every signed deal, so the sponsorship actually gets announced.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-flare-400">
              <FileCheck2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-display text-[15px] font-medium text-white">
                We prove it, deliverable by deliverable
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-300">
                Every activation item is tracked — posted or not, reach logged — so the sponsor has
                a real record to justify the spend internally, and to renew against next season
                instead of a deal that just quietly lapses.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-ink-400">
          This is the part that keeps a deal on the platform. Once a sponsor and a club have met,
          it's easy to just text each other next year — unless staying gives the sponsor something
          they'd lose by leaving: a dashboard instead of a dozen WhatsApp threads, an invoice
          instead of a bank transfer, and proof instead of a promise.
        </p>
      </section>

      {/* WHO ARE OUR USERS */}
      <section className="mt-12 border-t border-paper-line pt-10">
        <SectionEyebrow>Who we're building for</SectionEyebrow>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-5 w-5 text-flare-500" />
              <p className="font-display text-lg font-medium text-ink-950">Sponsors</p>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-700">
              Local and regional businesses — gyms, retailers, banks, breweries, insurers — who
              want their name in front of a specific local audience, not a national ad platform.
              Typically €500–€50,000 sponsorship budgets, no dedicated marketing team to go hunting
              for grassroots partners themselves.
            </p>
          </div>
          <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
            <div className="flex items-center gap-2.5">
              <Trophy className="h-5 w-5 text-flare-500" />
              <p className="font-display text-lg font-medium text-ink-950">Clubs & athletes</p>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-700">
              Amateur and semi-pro clubs, youth academies, and individual athletes across the
              Baltics with a real local following but no sales function — a coach, a volunteer, or
              the athlete themselves fielding sponsorship conversations in their spare time.
            </p>
          </div>
        </div>
      </section>

      {/* MARKET SIZE */}
      <section className="mt-12 border-t border-paper-line pt-10">
        <SectionEyebrow>Market size</SectionEyebrow>
        <h2 className="display mt-4 max-w-2xl text-3xl leading-[1.05] text-ink-950 sm:text-4xl">
          The opportunity
        </h2>
        <p className="mt-2 text-sm text-ink-400">
          Placeholders — replace with sourced figures before presenting.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <MarketStat
            label="TAM"
            value="€[__]M"
            note="Total sports sponsorship spend across Estonia, Latvia and Lithuania."
          />
          <MarketStat
            label="SAM"
            value="€[__]M"
            note="Spend realistically addressable by small/mid clubs and individual athletes — excludes top-tier stadium and league naming rights."
          />
          <MarketStat
            label="SOM"
            value="€[__]M"
            note="Realistic 3-year capture target at current commission rates."
          />
        </div>
      </section>

      {/* GO TO MARKET */}
      <section className="mt-12 border-t border-paper-line pt-10">
        <SectionEyebrow>Go-to-market</SectionEyebrow>
        <h2 className="display mt-4 max-w-2xl text-3xl leading-[1.05] text-ink-950 sm:text-4xl">
          Free first, so the flywheel starts.
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
            <div className="flex items-center gap-2.5">
              <Rocket className="h-5 w-5 text-flare-500" />
              <p className="font-display text-lg font-medium text-ink-950">Launch offer</p>
            </div>
            <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-ink-700">
              <li>
                Clubs & athletes: {clubPlan.currency}
                {clubPlan.priceMonthly}/mo after a free first {launchPromo.clubFreeMonths} month —
                supply has to be free to grow first.
              </li>
              <li>
                Sponsors: {membershipPlan.currency}
                {membershipPlan.priceMonthly}/mo after {launchPromo.sponsorFreeMonths} free months,
                at {Math.round(launchPromo.commissionRate * 100)}% launch commission instead of the
                standard {Math.round(commission.standard * 100)}%.
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="h-5 w-5 text-flare-500" />
              <p className="font-display text-lg font-medium text-ink-950">Rollout</p>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-700">
              Estonia first — the entry market, and where the pitch is happening. Lithuania and
              Latvia follow as an explicit second run, using the tax-relief angle already live in
              Lithuania's 200% deduction as the wedge.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-paper-line pt-8">
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
