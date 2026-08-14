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
      className={`group flex h-full flex-col rounded-2xl border p-6 text-left transition-all hover:-translate-y-1 hover:shadow-lift sm:p-7 ${
        primary
          ? 'border-accent-500 bg-accent-500 text-white'
          : 'border-slate-200 bg-white hover:border-accent-300'
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wider ${
          primary ? 'text-accent-100' : 'text-accent-500'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-2xl font-semibold tracking-tight ${
          primary ? 'text-white' : 'text-ink-900'
        }`}
      >
        {title}
      </h2>
      <p className={`mt-2 flex-1 text-sm leading-relaxed ${primary ? 'text-accent-50' : 'text-ink-500'}`}>
        {body}
      </p>
      <span
        className={`mt-5 inline-flex items-center gap-1.5 text-sm font-medium ${
          primary ? 'text-white' : 'text-accent-500'
        }`}
      >
        {cta}
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
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
    <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
          Private money can't find its way into sport.
          <span className="text-accent-500"> We're the market that lets it.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg">
          Thousands of Baltic clubs and athletes have real audiences and no way to be found, valued
          or funded. Thousands of businesses want local attention and no way to buy it. We match the
          two on audience, region, budget and goal — so the money finally moves.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <DoorCard
          primary
          eyebrow="For businesses"
          title="I want to back sport"
          body="Answer five quick questions and see the clubs and athletes that actually reach your customers, with what you get and what it costs."
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

      <p className="mt-6 text-sm text-ink-400">
        Free to join, free to browse, free to connect. We only earn when a deal closes — 2% on large
        deals, 10% on small.
      </p>

      <div className="mt-14 grid gap-8 border-t border-slate-200 pt-8 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Jump in as a sample sponsor
          </p>
          <div className="mt-4 space-y-2">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => onPersona(persona.answers)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-card"
              >
                <p className="text-sm font-semibold text-ink-900">{persona.label}</p>
                <p className="mt-0.5 text-xs text-ink-400">{persona.blurb}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Or as a sample club
          </p>
          <div className="mt-4 space-y-2">
            {clubSeeds.map((seed) => (
              <button
                key={seed.id}
                onClick={() => onClubSeed(seed.draft)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-card"
              >
                <p className="text-sm font-semibold text-ink-900">{seed.label}</p>
                <p className="mt-0.5 text-xs text-ink-400">{seed.blurb}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
