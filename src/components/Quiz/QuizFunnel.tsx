import { useState } from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { QuizStep } from './QuizStep';
import {
  budgetBands,
  countryOptions,
  demographicOptions,
  quizSteps,
  regionsByCountry,
} from '../../data/sponsorQuiz';
import type {
  ActivationType,
  BudgetBand,
  Country,
  Demographic,
  Priority,
  Region,
  SponsorAnswers,
} from '../../lib/types';

interface Draft {
  country?: Country;
  budgetBand?: BudgetBand;
  demographic?: Demographic;
  region?: Region | 'National';
  wants?: ActivationType | 'any';
  priority?: Priority;
  note?: string;
}

/** Appends free text from an "Other" field without losing what came before. */
function addNote(existing: string | undefined, text: string): string {
  return existing ? `${existing} · ${text}` : text;
}

/**
 * Just an entry box, not a wall of city tiles — a sponsor knows where they
 * operate better than a fixed list can offer it back to them. A typed name
 * that matches a known city still scores on that exact city; anything else
 * falls back to the country's nearest bucket and keeps the typed text as
 * context rather than guessing a city from it.
 */
function LocationStep({
  title,
  subtitle,
  cities,
  nationalIsPlausible,
  onSubmit,
}: {
  title: string;
  subtitle: string;
  cities: Region[];
  nationalIsPlausible: boolean;
  onSubmit: (region: Region | 'National', note?: string) => void;
}) {
  const [text, setText] = useState('');
  const [nationwide, setNationwide] = useState(false);

  function submit() {
    if (nationwide) {
      onSubmit('National');
      return;
    }
    const typed = text.trim();
    if (!typed) return;
    const matchedCity = cities.find((c) => c.toLowerCase() === typed.toLowerCase());
    onSubmit(matchedCity ?? cities[0], matchedCity ? undefined : `Location: ${typed}`);
  }

  return (
    <div className="animate-rise">
      <h2 className="display text-4xl leading-[1.05] text-ink-950 sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">{subtitle}</p>

      <input
        autoFocus
        disabled={nationwide}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="e.g. Tallinn, Tartu…"
        className="mt-9 w-full rounded-lg bg-white px-5 py-4 font-display text-xl text-ink-950 ring-1 ring-inset ring-paper-line placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-flare-500 disabled:opacity-40"
      />

      {nationalIsPlausible && (
        <label className="mt-3 flex items-center gap-2.5 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={nationwide}
            onChange={(e) => setNationwide(e.target.checked)}
            className="h-4 w-4 rounded-sm border-paper-line accent-flare-500"
          />
          Nationwide — no specific city
        </label>
      )}

      <Button
        size="lg"
        className="mt-5"
        disabled={!nationwide && !text.trim()}
        onClick={submit}
      >
        Continue
      </Button>
    </div>
  );
}

export function QuizFunnel({
  onComplete,
  presetCountry,
  onCancel,
}: {
  onComplete: (answers: SponsorAnswers) => void;
  /** Taken from the sponsor's account, so we never ask for it twice. */
  presetCountry?: Country;
  onCancel?: () => void;
}) {
  // The account already told us the country; drop that question rather than
  // asking the same thing on two consecutive screens.
  const steps = presetCountry ? quizSteps.filter((q) => q.id !== 'country') : quizSteps;

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(presetCountry ? { country: presetCountry } : {});

  const current = steps[step];

  function advance(patch: Draft) {
    const next = { ...draft, ...patch };
    setDraft(next);

    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    onComplete({
      country: next.country!,
      budgetBand: next.budgetBand!,
      budget: next.budgetBand!.midpoint,
      demographic: next.demographic!,
      region: next.region!,
      wants: next.wants ?? 'any',
      priority: next.priority,
      note: next.note,
    });
  }

  function renderStep() {
    switch (current.id) {
      case 'country':
        return (
          <QuizStep
            title={current.title}
            subtitle={current.subtitle}
            options={countryOptions.map((c) => ({ value: c.value, label: c.label }))}
            selected={draft.country}
            onSelect={(country) => advance({ country, region: undefined })}
          />
        );
      case 'budget':
        return (
          <QuizStep
            title={current.title}
            subtitle={current.subtitle}
            options={budgetBands.map((b) => ({ value: b.id, label: b.label }))}
            selected={draft.budgetBand?.id}
            onSelect={(id) => advance({ budgetBand: budgetBands.find((b) => b.id === id)! })}
            otherPlaceholder="e.g. flexible, depends on the deal"
            onOther={(text) =>
              advance({
                // No band fits a written-in answer — default to the middle
                // band rather than guessing a number from free text.
                budgetBand: draft.budgetBand ?? budgetBands[1],
                note: addNote(draft.note, `Budget: ${text}`),
              })
            }
          />
        );
      case 'demographic':
        return (
          <QuizStep
            title={current.title}
            subtitle={current.subtitle}
            options={demographicOptions}
            selected={draft.demographic}
            onSelect={(demographic) => advance({ demographic })}
            otherPlaceholder="e.g. students, new parents…"
            onOther={(text) =>
              advance({ demographic: 'all', note: addNote(draft.note, `Audience: ${text}`) })
            }
          />
        );
      case 'region': {
        const cities = regionsByCountry[draft.country ?? 'EE'];
        // Conditional on the budget answer: a national campaign isn't a real
        // option at the smallest band, so we don't offer it there.
        const nationalIsPlausible = (draft.budgetBand?.max ?? 0) > 2000;
        return (
          <LocationStep
            title={current.title}
            subtitle={current.subtitle}
            cities={cities}
            nationalIsPlausible={nationalIsPlausible}
            onSubmit={(region, note) => advance({ region, note: note ? addNote(draft.note, note) : draft.note })}
          />
        );
      }
      default:
        return null;
    }
  }

  return (
    // Fills the viewport so the question sits in a composed frame rather than
    // floating at the top of an empty page.
    <div className="flex flex-1 flex-col">

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-10">
        <div className="w-full">
          <ProgressBar current={step} total={steps.length} />
          <div className="mt-9">{renderStep()}</div>

          {(step > 0 || onCancel) && (
            <div className="mt-8">
              <Button variant="ghost" onClick={() => (step > 0 ? setStep(step - 1) : onCancel?.())}>
                ← Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
