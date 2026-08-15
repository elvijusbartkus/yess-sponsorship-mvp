import { ArrowRight } from 'lucide-react';
import { clubPlan, membershipPlan } from '../data/pricing';

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
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg p-6 text-left transition-all duration-200 hover:-translate-y-1.5 sm:p-8 ${
        ink
          ? 'bg-ink-950 text-white ring-1 ring-inset ring-white/10 hover:shadow-lift'
          : 'bg-flare-500 text-white hover:shadow-flare'
      }`}
    >
      <p className={`eyebrow ${ink ? 'text-flare-400' : 'text-white/70'}`}>{eyebrow}</p>

      <h2 className="display mt-3 text-4xl leading-[1.05] text-white sm:text-5xl">{title}</h2>

      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/80">
        {body}
      </p>

      {/* A real button shape, not just text with an arrow — this is THE action on the page. */}
      <span
        className={`mt-7 inline-flex w-fit items-center gap-2 rounded-md px-5 py-3 font-display text-base font-medium transition-all duration-200 ${
          ink
            ? 'bg-white text-ink-950 group-hover:bg-flare-500 group-hover:text-white'
            : 'bg-ink-950 text-white group-hover:bg-white group-hover:text-ink-950'
        }`}
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
      </span>
    </button>
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
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:py-12"
      style={{ zoom: 1.25 }}
    >
      <div className="animate-rise max-w-3xl">
        <div className="flare-rule h-1.5 w-20" />
        <h1 className="display mt-4 text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[0.95] text-ink-950">
          There's private money for sport.
          <br />
          <span className="text-flare-500">We're the market it's been missing.</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg font-medium leading-snug text-ink-700 sm:text-xl">
          We match Baltic clubs and athletes with the businesses that want their audience. Then we
          run the campaign and prove it happened.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <DoorCard
          tone="ink"
          eyebrow="For businesses"
          title="Get matched"
          cta="See your matches"
          body="Answer three questions about your budget and audience."
          onClick={onSponsorStart}
        />
        <DoorCard
          tone="flare"
          eyebrow="For clubs & athletes"
          title="Get funded"
          cta="List your profile"
          body="Sponsors find you. Keep your other sponsors and agents, this isn't exclusive."
          onClick={onClubStart}
        />
      </div>

      {/* PROBLEM — sits right under the main CTAs now. */}
      <section className="mt-16 border-t border-paper-line pt-14">
        <SectionEyebrow>The problem</SectionEyebrow>
        <h2 className="display mt-3 max-w-2xl text-3xl leading-[1.1] text-ink-950 sm:text-4xl">
          Private sport money never reaches the clubs and athletes that need it.
        </h2>
        <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
            <p className="text-xl leading-snug text-ink-800 sm:text-2xl">
              <span className="display text-flare-500">€500M</span> a year in Estonian sport.
              Business gives just <span className="display text-flare-500">€25M</span>, grassroots
              sees almost none.
            </p>
          </div>
          <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
            <p className="text-xl leading-snug text-ink-800 sm:text-2xl">
              <span className="display text-flare-500">50–65%</span> of sporting success is
              bought, not trained.
            </p>
            <p className="mt-2 text-sm text-ink-400">SPLISS research</p>
          </div>
          <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
            <p className="text-xl leading-snug text-ink-800 sm:text-2xl">
              A club needs <span className="display text-flare-500">€5,000</span>. A business has
              it to give. They never meet.
            </p>
          </div>
        </div>
      </section>

      {/* MARKET SIZE */}
      <section className="mt-16 border-t border-paper-line pt-14">
        <SectionEyebrow>Market size</SectionEyebrow>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          <MarketStat label="TAM" value="€25M" note="Private money into Estonian sport a year." />
          <MarketStat
            label="SAM"
            value="€10M"
            note="The middle of the pyramid, where matching is broken."
          />
          <MarketStat label="SOM" value="€80k/yr" note="Realistic Year 1 revenue." />
        </div>
      </section>

      {/* GO-TO-MARKET — brief on purpose: incentive, why sponsors stick, why
          clubs join, and the one partnership that scales it. Same punchy
          card treatment as the problem section, readable in ~30s. */}
      <section className="mt-16 border-t border-paper-line pt-14">
        <SectionEyebrow>Go-to-market</SectionEyebrow>
        <h2 className="display mt-3 max-w-2xl text-3xl leading-[1.1] text-ink-950 sm:text-4xl">
          Free to start. Built to stick. One partner scales it.
        </h2>
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
            <p className="text-xl leading-snug text-ink-800 sm:text-2xl">
              <span className="display text-flare-500">Free to try.</span> First period free for
              everyone.
            </p>
          </div>
          <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
            <p className="text-xl leading-snug text-ink-800 sm:text-2xl">
              <span className="display text-flare-500">Sponsors stay</span> for the campaign and
              the proof.
            </p>
          </div>
          <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
            <p className="text-xl leading-snug text-ink-800 sm:text-2xl">
              <span className="display text-flare-500">Clubs join</span> because it's free and
              sponsors come to them.
            </p>
          </div>
          <div className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line">
            <p className="text-xl leading-snug text-ink-800 sm:text-2xl">
              <span className="display text-flare-500">One Committee partnership</span> onboards
              every club.
            </p>
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
          {membershipPlan.priceMonthly}/mo · first period free →
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
