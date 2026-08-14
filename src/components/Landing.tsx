import { ArrowRight, Search, Handshake, FileCheck2 } from 'lucide-react';
import { profiles } from '../data/profiles';
import { COUNTRY_LABEL } from '../lib/matching';
import { clubPlan, launchPromo, membershipPlan } from '../data/pricing';
import type { Country } from '../lib/types';

const byCountry = profiles.reduce<Record<Country, number>>(
  (acc, p) => ({ ...acc, [p.country]: (acc[p.country] ?? 0) + 1 }),
  { EE: 0, LV: 0, LT: 0 },
);

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
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg p-7 text-left transition-all duration-200 hover:-translate-y-1.5 sm:p-8 ${
        ink ? 'bg-ink-950 text-white hover:shadow-lift' : 'bg-flare-500 text-white hover:shadow-flare'
      }`}
    >
      <p className={`eyebrow ${ink ? 'text-flare-400' : 'text-white/70'}`}>{eyebrow}</p>

      <h2 className="display mt-3 text-3xl leading-[1.05] text-white sm:text-4xl">{title}</h2>

      <p className={`mt-2.5 flex-1 text-[15px] leading-relaxed ${ink ? 'text-ink-300' : 'text-white/80'}`}>
        {body}
      </p>

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
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:py-14">
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

      {/* Real proof, not a claim — this is the actual seed data on the
          platform right now, not an invented testimonial or demand figure. */}
      <div className="animate-rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500">
        <span className="font-medium text-ink-950">{profiles.length} clubs & athletes already listed</span>
        <span className="hidden h-1 w-1 rounded-full bg-ink-300 sm:inline-block" />
        <span>
          {byCountry.EE} {COUNTRY_LABEL.EE} · {byCountry.LT} {COUNTRY_LABEL.LT} · {byCountry.LV}{' '}
          {COUNTRY_LABEL.LV}
        </span>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2">
        <DoorCard
          tone="ink"
          eyebrow="For businesses"
          title="Back sport"
          body="Three questions. See who reaches your customers."
          cta="Find my matches"
          onClick={onSponsorStart}
        />
        <DoorCard
          tone="flare"
          eyebrow="For clubs & athletes"
          title="Get funded"
          body="Free profile. Sponsors find you."
          cta="Get discovered"
          onClick={onClubStart}
        />
      </div>

      <section className="mt-14 grid gap-8 border-t border-paper-line pt-10 sm:grid-cols-2">
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
        </div>
        <div>
          <p className="eyebrow text-ink-400">How it works for clubs & athletes</p>
          <div className="mt-5 space-y-5">
            <Step icon={Search} label="Build a free profile" body="Eight quick questions, no cost, ever." />
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
