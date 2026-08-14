import { personas } from '../data/personas';
import { clubSeeds } from '../data/clubFlow';
import type { ProfileDraft, SponsorAnswers } from '../lib/types';

function DoorCard({
  eyebrow,
  title,
  body,
  cta,
  onClick,
  primary,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 text-left transition-all duration-200 hover:-translate-y-1.5 sm:p-8 ${
        primary
          ? 'bg-ink-950 text-white hover:shadow-flare'
          : 'bg-white ring-1 ring-inset ring-paper-line hover:shadow-lift hover:ring-ink-950'
      }`}
    >
      {primary && <div className="flare-rule absolute inset-x-0 top-0 h-2" />}

      <p className={`eyebrow ${primary ? 'text-flare-400' : 'text-flare-600'}`}>{eyebrow}</p>

      <h2
        className={`display mt-4 text-3xl leading-[1.05] sm:text-4xl ${
          primary ? 'text-white' : 'text-ink-950'
        }`}
      >
        {title}
      </h2>

      <p
        className={`mt-3 flex-1 text-[15px] leading-relaxed ${
          primary ? 'text-ink-300' : 'text-ink-500'
        }`}
      >
        {body}
      </p>

      <span
        className={`mt-7 inline-flex items-center gap-2 font-display text-base font-medium ${
          primary ? 'text-flare-400' : 'text-ink-950'
        }`}
      >
        {cta}
        <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
      </span>
    </button>
  );
}

function QuickStart({
  title,
  body,
  onClick,
}: {
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl bg-white p-4 text-left ring-1 ring-inset ring-paper-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:ring-ink-950"
    >
      <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-flare-500 transition-transform duration-200 group-hover:scale-y-100" />
      <p className="font-display text-[15px] font-medium text-ink-950">{title}</p>
      <p className="mt-0.5 text-[13px] text-ink-400">{body}</p>
    </button>
  );
}

export function Landing({
  onSponsorStart,
  onClubStart,
  onPersona,
  onClubSeed,
}: {
  onSponsorStart: () => void;
  onClubStart: () => void;
  onPersona: (answers: SponsorAnswers) => void;
  onClubSeed: (draft: ProfileDraft) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-24">
      <div className="animate-rise max-w-4xl">
        <div className="flare-rule h-2 w-28" />
        <h1 className="display mt-7 text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.92] text-ink-950">
          Private money can't
          <br />
          find its way into sport.
          <br />
          <span className="text-flare-500">We're the market that lets it.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-500">
          Thousands of Baltic clubs and athletes have real audiences and no way to be found, valued
          or funded. Thousands of businesses want local attention and no way to buy it. We match the
          two on audience, region, budget and goal — so the money finally moves.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <DoorCard
          primary
          eyebrow="For businesses"
          title="I want to back sport"
          body="Answer six quick questions and see the clubs and athletes that actually reach your customers, with what you get and what it costs."
          cta="Find my matches"
          onClick={onSponsorStart}
        />
        <DoorCard
          eyebrow="For clubs & athletes"
          title="I want funding"
          body="Build a free profile in two minutes and become discoverable to every sponsor searching your market. No fees, ever, to be listed or contacted."
          cta="Get discovered"
          onClick={onClubStart}
        />
      </div>

      <p className="mt-7 text-sm text-ink-500">
        Free to join, free to browse, free to connect.{' '}
        <span className="text-ink-950">We only earn when a deal closes</span> — 2% on large deals,
        10% on small.
      </p>

      <div className="mt-20 grid gap-10 border-t border-paper-line pt-10 sm:grid-cols-2">
        <div>
          <p className="eyebrow text-ink-400">Jump in as a sample sponsor</p>
          <div className="mt-5 space-y-2.5">
            {personas.map((persona) => (
              <QuickStart
                key={persona.id}
                title={persona.label}
                body={persona.blurb}
                onClick={() => onPersona(persona.answers)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow text-ink-400">Or as a sample club</p>
          <div className="mt-5 space-y-2.5">
            {clubSeeds.map((seed) => (
              <QuickStart
                key={seed.id}
                title={seed.label}
                body={seed.blurb}
                onClick={() => onClubSeed(seed.draft)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
