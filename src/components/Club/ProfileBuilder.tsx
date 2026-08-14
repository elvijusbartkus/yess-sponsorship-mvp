import { useState } from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { QuizStep } from '../Quiz/QuizStep';
import {
  activationOptions,
  activationTypeOf,
  audienceBands,
  clubRegionsByCountry,
  dealRangeOptions,
  socialBands,
  sportOptions,
} from '../../data/clubFlow';
import { countryOptions } from '../../data/sponsorQuiz';
import type { Country, ProfileDraft, Region } from '../../lib/types';

const STEPS = [
  {
    id: 'identity',
    title: 'Who are you?',
    subtitle: 'This is the name sponsors will see. Listing is free, and always will be.',
  },
  { id: 'sport', title: 'What sport?', subtitle: 'So we match you to the right brands.' },
  { id: 'country', title: 'Which country?', subtitle: 'Sponsors search inside their own market.' },
  { id: 'region', title: 'Where are you based?', subtitle: 'Local sponsors search by city.' },
  { id: 'audience', title: 'How many people do you reach?', subtitle: 'Matchday, members, followers — your honest estimate.' },
  { id: 'social', title: 'Social following?', subtitle: 'Optional. Skip if you are not on social yet.' },
  { id: 'activation', title: 'What can you offer a sponsor?', subtitle: 'Pick everything you could realistically deliver.' },
  { id: 'deal', title: 'What sponsorship size suits you?', subtitle: 'A guide, not a commitment.' },
] as const;

interface Draft extends Partial<ProfileDraft> {}

export function ProfileBuilder({
  onComplete,
  onCancel,
  initial,
}: {
  onComplete: (draft: ProfileDraft) => void;
  onCancel: () => void;
  initial?: ProfileDraft;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(initial ?? { activation: [] });
  const [nameInput, setNameInput] = useState(initial?.name ?? '');

  const current = STEPS[step];

  function advance(patch: Draft) {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    const chosen = next.activation ?? [];
    onComplete({
      ...(next as ProfileDraft),
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
              {current.title}
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">{current.subtitle}</p>

            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. FC Tartu Kalev"
              className="mt-9 w-full rounded-2xl bg-white px-5 py-4 font-display text-xl text-ink-950 ring-1 ring-inset ring-paper-line placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-flare-500"
            />

            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {(['club', 'athlete'] as const).map((type) => (
                <button
                  key={type}
                  disabled={!nameInput.trim()}
                  onClick={() => advance({ name: nameInput.trim(), type })}
                  className="group relative overflow-hidden rounded-2xl bg-white px-5 py-4 text-left font-display text-lg font-medium text-ink-950 ring-1 ring-inset ring-paper-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  I'm {type === 'club' ? 'a club' : 'an athlete'}
                </button>
              ))}
            </div>
          </div>
        );

      case 'sport':
        return (
          <QuizStep
            title={current.title}
            subtitle={current.subtitle}
            options={sportOptions.map((s) => ({ value: s, label: s }))}
            selected={draft.sport}
            onSelect={(sport) => advance({ sport })}
          />
        );

      case 'country':
        return (
          <QuizStep
            title={current.title}
            subtitle={current.subtitle}
            options={countryOptions.map((c) => ({ value: c.value, label: c.label }))}
            selected={draft.country}
            onSelect={(country: Country) => advance({ country, region: undefined })}
          />
        );

      case 'region':
        return (
          <QuizStep
            title={current.title}
            subtitle={current.subtitle}
            options={clubRegionsByCountry[draft.country ?? 'EE'].map((r) => ({
              value: r,
              label: r,
            }))}
            selected={draft.region}
            onSelect={(region: Region) => advance({ region })}
          />
        );

      case 'audience':
        return (
          <QuizStep
            title={current.title}
            subtitle={current.subtitle}
            options={audienceBands.map((b) => ({ value: b.id, label: b.label }))}
            selected={audienceBands.find((b) => b.value === draft.audienceSize)?.id}
            onSelect={(id) =>
              advance({ audienceSize: audienceBands.find((b) => b.id === id)!.value })
            }
          />
        );

      case 'social':
        return (
          <QuizStep
            title={current.title}
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
              {current.title}
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">{current.subtitle}</p>

            <div className="mt-9 grid gap-2.5 sm:grid-cols-2">
              {activationOptions.map((item) => {
                const on = selected.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleActivation(item)}
                    className={`rounded-2xl px-5 py-4 text-left font-display text-lg font-medium transition-all duration-200 ${
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
            title={current.title}
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
    // Mirrors the sponsor funnel's frame, labelled for the other side.
    <div className="relative flex flex-1">
      <aside className="relative hidden w-[clamp(80px,10vw,150px)] shrink-0 bg-ink-950 lg:block">
        <div className="flare-rule absolute inset-y-0 right-0 w-1.5 opacity-90" />
        <span className="eyebrow absolute bottom-12 left-1/2 -translate-x-1/2 rotate-180 whitespace-nowrap text-ink-500 [writing-mode:vertical-rl]">
          For clubs &amp; athletes
        </span>
      </aside>

      <div className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-xl">
          <ProgressBar current={step} total={STEPS.length} />
          <div className="mt-12">{renderStep()}</div>

          <div className="mt-10">
            <Button variant="ghost" onClick={() => (step > 0 ? setStep(step - 1) : onCancel())}>
              ← Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
