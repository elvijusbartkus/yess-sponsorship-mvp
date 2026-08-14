import { useState } from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { QuizStep } from './QuizStep';
import {
  budgetBands,
  countryOptions,
  demographicOptions,
  goalOptions,
  quizSteps,
  regionsByCountry,
} from '../../data/sponsorQuiz';
import type {
  BudgetBand,
  Country,
  Demographic,
  Goal,
  Region,
  SponsorAnswers,
} from '../../lib/types';

interface Draft {
  country?: Country;
  budgetBand?: BudgetBand;
  demographic?: Demographic;
  region?: Region | 'National';
  goal?: Goal;
}

export function QuizFunnel({ onComplete }: { onComplete: (answers: SponsorAnswers) => void }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({});

  const current = quizSteps[step];

  function advance(patch: Draft) {
    const next = { ...draft, ...patch };
    setDraft(next);

    if (step < quizSteps.length - 1) {
      setStep(step + 1);
      return;
    }

    onComplete({
      country: next.country!,
      budgetBand: next.budgetBand!,
      budget: next.budgetBand!.midpoint,
      demographic: next.demographic!,
      region: next.region!,
      goal: next.goal!,
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
        const options: { value: Region | 'National'; label: string; hint?: string }[] = [
          ...cities.map((city) => ({ value: city as Region | 'National', label: city })),
          { value: 'National', label: 'Nationally', hint: 'Country-wide visibility' },
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
      case 'goal':
        return (
          <QuizStep
            title={current.title}
            subtitle={current.subtitle}
            options={goalOptions}
            selected={draft.goal}
            onSelect={(goal) => advance({ goal })}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-16">
      <ProgressBar current={step} total={quizSteps.length} />
      <div className="mt-10">{renderStep()}</div>

      {step > 0 && (
        <div className="mt-8">
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            ← Back
          </Button>
        </div>
      )}
    </div>
  );
}
