import { useState } from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { QuizStep } from '../Quiz/QuizStep';
import {
  activationTypeOf,
  athleteActivations,
  athleteAudienceBands,
  clubActivations,
  clubAudienceBands,
  clubRegionsByCountry,
  competitionLevels,
  dealRangeOptions,
  socialBands,
  sportOptions,
} from '../../data/clubFlow';
import { countryOptions } from '../../data/sponsorQuiz';
import type { ProfileDraft, Region } from '../../lib/types';

type StepId =
  | 'identity'
  | 'sport'
  | 'location'
  | 'level'
  | 'audience'
  | 'social'
  | 'activation'
  | 'deal';

interface Draft extends Partial<ProfileDraft> {}

/**
 * A club and an athlete are not the same business, so they don't get the same
 * questions. Type is asked first (folded into the identity step) and every
 * later step reads from it: a club is asked about a home crowd and what a
 * venue can carry, an athlete about a following and the level they compete at.
 * Type+name and country+region are each collected in one screen — the two
 * halves are related enough that splitting them into separate steps was pure
 * friction, not signal.
 */
const STEPS: {
  id: StepId;
  title: (d: Draft) => string;
  subtitle: string;
  when?: (d: Draft) => boolean;
}[] = [
  {
    id: 'identity',
    title: () => 'Club or athlete?',
    subtitle: 'The questions change — sponsors buy the two very differently.',
  },
  {
    id: 'sport',
    title: (d) => (d.type === 'athlete' ? 'Your sport?' : 'What sport?'),
    subtitle: 'So we match you to the right brands.',
  },
  {
    id: 'location',
    title: () => 'Where are you based?',
    subtitle: 'Sponsors search their own market, then by city.',
  },
  {
    id: 'level',
    title: () => 'What level do you compete at?',
    subtitle: 'A sponsor buys the level as much as the numbers.',
    when: (d) => d.type === 'athlete',
  },
  {
    id: 'audience',
    title: (d) =>
      d.type === 'athlete' ? 'How big is your following?' : 'How many come to a home game?',
    subtitle: 'Your honest estimate.',
  },
  {
    id: 'social',
    title: () => 'Club social following?',
    subtitle: 'Optional.',
    when: (d) => d.type === 'club',
  },
  {
    id: 'activation',
    title: () => 'What can you offer a sponsor?',
    subtitle: 'Pick everything you could realistically deliver.',
  },
  {
    id: 'deal',
    title: () => 'What sponsorship size suits you?',
    subtitle: 'A guide, not a commitment.',
  },
];

export function ProfileBuilder({
  onComplete,
  onCancel,
  initial,
}: {
  onComplete: (draft: ProfileDraft) => void;
  onCancel: () => void;
  initial?: ProfileDraft;
}) {
  const [draft, setDraft] = useState<Draft>(initial ?? { activation: [] });
  const [step, setStep] = useState(0);
  const [nameInput, setNameInput] = useState(initial?.name ?? '');
  const [customActivation, setCustomActivation] = useState('');

  const steps = STEPS.filter((s) => !s.when || s.when(draft));
  const current = steps[Math.min(step, steps.length - 1)];

  const audienceBands = draft.type === 'athlete' ? athleteAudienceBands : clubAudienceBands;
  const activations = draft.type === 'athlete' ? athleteActivations : clubActivations;

  function advance(patch: Draft) {
    const next = { ...draft, ...patch };
    setDraft(next);

    // Recomputed against the new answers, so choosing a type reshapes the rest.
    const remaining = STEPS.filter((s) => !s.when || s.when(next));
    if (step < remaining.length - 1) {
      setStep(step + 1);
      return;
    }

    const chosen = next.activation ?? [];
    onComplete({
      ...(next as ProfileDraft),
      instagramFollowers: next.instagramFollowers ?? 0,
      activationTypes: [...new Set(chosen.map((a) => activationTypeOf[a]).filter(Boolean))],
    });
  }

  function toggleActivation(item: string) {
    const list = draft.activation ?? [];
    setDraft({
      ...draft,
      activation: list.includes(item) ? list.filter((a) => a !== item) : [...list, item],
    });
  }

  function renderStep() {
    switch (current.id) {
      case 'identity':
        return (
          <div className="animate-rise">
            <h2 className="display text-4xl leading-[1.05] text-ink-950 sm:text-5xl">
              {current.title(draft)}
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
              {current.subtitle}
            </p>
            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {(
                [
                  { value: 'club', label: "We're a club", hint: 'A team with members and a venue' },
                  { value: 'athlete', label: "I'm an athlete", hint: 'An individual competitor' },
                ] as const
              ).map((opt) => {
                const on = draft.type === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDraft({ ...draft, type: opt.value })}
                    className={`rounded-lg px-5 py-4 text-left transition-all duration-200 ${
                      on
                        ? 'bg-ink-950 text-white'
                        : 'bg-white text-ink-950 ring-1 ring-inset ring-paper-line hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink-950'
                    }`}
                  >
                    <p className="font-display text-lg font-medium">{opt.label}</p>
                    <p className={`mt-0.5 text-sm ${on ? 'text-white/80' : 'text-ink-500'}`}>
                      {opt.hint}
                    </p>
                  </button>
                );
              })}
            </div>
            {draft.type && (
              <div className="mt-7 animate-rise">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && nameInput.trim())
                      advance({ type: draft.type, name: nameInput.trim() });
                  }}
                  placeholder={
                    draft.type === 'athlete' ? 'e.g. Kertu Lepik' : 'e.g. FC Tartu Kalev'
                  }
                  className="w-full rounded-lg bg-white px-5 py-4 font-display text-xl text-ink-950 ring-1 ring-inset ring-paper-line placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-flare-500"
                />
                <Button
                  size="lg"
                  className="mt-5"
                  disabled={!nameInput.trim()}
                  onClick={() => advance({ type: draft.type, name: nameInput.trim() })}
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        );

      case 'sport':
        return (
          <QuizStep
            title={current.title(draft)}
            subtitle={current.subtitle}
            options={sportOptions.map((s) => ({ value: s, label: s }))}
            selected={draft.sport}
            onSelect={(sport) => advance({ sport })}
            otherPlaceholder="e.g. Padel, Orienteering…"
            onOther={(sport) => advance({ sport })}
          />
        );

      case 'location':
        return (
          <div className="animate-rise">
            <h2 className="display text-4xl leading-[1.05] text-ink-950 sm:text-5xl">
              {current.title(draft)}
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
              {current.subtitle}
            </p>
            <p className="mt-8 eyebrow text-ink-400">Country</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {countryOptions.map((c) => {
                const on = draft.country === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => setDraft({ ...draft, country: c.value, region: undefined })}
                    className={`rounded-lg px-5 py-3.5 text-left font-display text-lg font-medium transition-all duration-200 ${
                      on
                        ? 'bg-ink-950 text-white'
                        : 'bg-white text-ink-950 ring-1 ring-inset ring-paper-line hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink-950'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
            {draft.country && (
              <div className="animate-rise">
                <p className="mt-8 eyebrow text-ink-400">
                  {draft.type === 'athlete' ? 'Based in' : 'Home city'}
                </p>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                  {clubRegionsByCountry[draft.country].map((r) => (
                    <button
                      key={r}
                      onClick={() => advance({ country: draft.country, region: r as Region })}
                      className="rounded-lg bg-white px-5 py-3.5 text-left font-display text-lg font-medium text-ink-950 ring-1 ring-inset ring-paper-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink-950"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'level':
        return (
          <QuizStep
            title={current.title(draft)}
            subtitle={current.subtitle}
            options={competitionLevels}
            selected={draft.competitionLevel}
            onSelect={(competitionLevel) => advance({ competitionLevel })}
          />
        );

      case 'audience':
        return (
          <QuizStep
            title={current.title(draft)}
            subtitle={current.subtitle}
            options={audienceBands.map((b) => ({ value: b.id, label: b.label }))}
            selected={audienceBands.find((b) => b.value === draft.audienceSize)?.id}
            onSelect={(id) => {
              const value = audienceBands.find((b) => b.id === id)!.value;
              // An athlete's following IS their audience — don't ask twice.
              advance(
                draft.type === 'athlete'
                  ? { audienceSize: value, instagramFollowers: value }
                  : { audienceSize: value },
              );
            }}
          />
        );

      case 'social':
        return (
          <QuizStep
            title={current.title(draft)}
            subtitle={current.subtitle}
            options={socialBands.map((b) => ({ value: b.id, label: b.label }))}
            selected={socialBands.find((b) => b.value === draft.instagramFollowers)?.id}
            onSelect={(id) =>
              advance({ instagramFollowers: socialBands.find((b) => b.id === id)!.value })
            }
          />
        );

      case 'activation': {
        const selected = draft.activation ?? [];
        return (
          <div className="animate-rise">
            <h2 className="display text-4xl leading-[1.05] text-ink-950 sm:text-5xl">
              {current.title(draft)}
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
              {current.subtitle}
            </p>
            <div className="mt-9 grid gap-2.5 sm:grid-cols-2">
              {activations.map((item) => {
                const on = selected.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleActivation(item)}
                    className={`rounded-lg px-5 py-4 text-left font-display text-lg font-medium transition-all duration-200 ${
                      on
                        ? 'bg-ink-950 text-white'
                        : 'bg-white text-ink-950 ring-1 ring-inset ring-paper-line hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink-950'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                value={customActivation}
                onChange={(e) => setCustomActivation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customActivation.trim()) {
                    toggleActivation(customActivation.trim());
                    setCustomActivation('');
                  }
                }}
                placeholder="Something else you can offer…"
                className="min-w-0 flex-1 rounded-lg bg-white px-4 py-2.5 text-sm text-ink-950 ring-1 ring-inset ring-paper-line placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-flare-500"
              />
              <button
                disabled={!customActivation.trim()}
                onClick={() => {
                  if (!customActivation.trim()) return;
                  toggleActivation(customActivation.trim());
                  setCustomActivation('');
                }}
                className="rounded-md bg-ink-950 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
              >
                Add
              </button>
            </div>

            <Button
              className="mt-7"
              size="lg"
              disabled={selected.length === 0}
              onClick={() => advance({})}
            >
              Continue
            </Button>
          </div>
        );
      }

      case 'deal':
        return (
          <QuizStep
            title={current.title(draft)}
            subtitle={current.subtitle}
            options={dealRangeOptions.map((d) => ({ value: d.id, label: d.label }))}
            selected={dealRangeOptions.find((d) => d.value[0] === draft.dealRange?.[0])?.id}
            onSelect={(id) =>
              advance({ dealRange: dealRangeOptions.find((d) => d.id === id)!.value })
            }
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-14">
        <div className="w-full">
          <ProgressBar current={step} total={steps.length} />
          <div className="mt-9">{renderStep()}</div>

          <div className="mt-8">
            <Button variant="ghost" onClick={() => (step > 0 ? setStep(step - 1) : onCancel())}>
              ← Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
