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
          />
        );
      case 'region': {
        const cities = regionsByCountry[draft.country ?? 'EE'];
        // Conditional on the budget answer: a national campaign isn't a real
        // option at the smallest band, so we don't offer it there.
        const nationalIsPlausible = (draft.budgetBand?.max ?? 0) > 2000;
        const options: { value: Region | 'National'; label: string; hint?: string }[] = [
          ...cities.map((city) => ({ value: city as Region | 'National', label: city })),
          ...(nationalIsPlausible
            ? [
                {
                  value: 'National' as Region | 'National',
                  label: 'Nationally',
                  hint: 'Country-wide visibility',
                },
              ]
            : []),
        ];
        return (
          <QuizStep
            title={current.title}
            subtitle={current.subtitle}
            options={options}
            selected={draft.region}
            onSelect={(region) => advance({ region })}
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

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-14">
        <div className="w-full">
          <ProgressBar current={step} total={steps.length} />
          <div className="mt-12">{renderStep()}</div>

          {(step > 0 || onCancel) && (
            <div className="mt-10">
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
