import { useState } from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { QuizStep } from '../Quiz/QuizStep';
import {
  activationOptions,
  audienceBands,
  clubRegionsByCountry,
  dealRangeOptions,
  socialBands,
  sportOptions,
} from '../../data/clubFlow';
import { countryOptions } from '../../data/sponsorQuiz';
import type { Country, ProfileDraft, Region } from '../../lib/types';

const STEPS = [
  { id: 'identity', title: 'Who are you?', subtitle: 'This is the name sponsors will see.' },
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
    onComplete(next as ProfileDraft);
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
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              {current.title}
            </h2>
            <p className="mt-2 text-sm text-ink-400">{current.subtitle}</p>

            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. FC Tartu Kalev"
              className="mt-8 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-300 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(['club', 'athlete'] as const).map((type) => (
                <button
                  key={type}
                  disabled={!nameInput.trim()}
                  onClick={() => advance({ name: nameInput.trim(), type })}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left font-medium text-ink-900 transition-all hover:border-accent-300 hover:shadow-card disabled:cursor-not-allowed disabled:opacity-40"
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
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              {current.title}
            </h2>
            <p className="mt-2 text-sm text-ink-400">{current.subtitle}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {activationOptions.map((item) => {
                const on = selected.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleActivation(item)}
                    className={`rounded-xl border p-4 text-left font-medium transition-all ${
                      on
                        ? 'border-accent-500 bg-accent-50 text-accent-700 ring-1 ring-accent-500'
                        : 'border-slate-200 bg-white text-ink-900 hover:border-accent-300'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <Button
              className="mt-6"
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
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-16">
      <ProgressBar current={step} total={STEPS.length} />
      <div className="mt-10">{renderStep()}</div>

      <div className="mt-8">
        <Button variant="ghost" onClick={() => (step > 0 ? setStep(step - 1) : onCancel())}>
          ← Back
        </Button>
      </div>
    </div>
  );
}
