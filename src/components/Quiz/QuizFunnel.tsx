import { useState } from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { QuizStep } from './QuizStep';
import {
  budgetBands,
  countryOptions,
  demographicOptions,
  goalOptions,
  priorityOptions,
  quizSteps,
  regionsByCountry,
} from '../../data/sponsorQuiz';
import type {
  BudgetBand,
  Country,
  Demographic,
  Goal,
  Priority,
  Region,
  SponsorAnswers,
} from '../../lib/types';

interface Draft {
  country?: Country;
  budgetBand?: BudgetBand;
  demographic?: Demographic;
  region?: Region | 'National';
  goal?: Goal;
  priority?: Priority;
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
      case 'priority':
        return (
          <QuizStep
            title={current.title}
            subtitle={current.subtitle}
            options={priorityOptions}
            selected={draft.priority}
            onSelect={(priority) => advance({ priority })}
          />
        );
      default:
        return null;
    }
  }

  return (
    // Fills the viewport so the question sits in a composed frame rather than
    // floating at the top of an empty page.
    <div className="relative flex flex-1">
      <aside className="relative hidden w-[clamp(80px,10vw,150px)] shrink-0 bg-ink-950 lg:block">
        <div className="flare-rule absolute inset-y-0 right-0 w-1.5 opacity-90" />
        <span className="eyebrow absolute bottom-12 left-1/2 -translate-x-1/2 rotate-180 whitespace-nowrap text-ink-500 [writing-mode:vertical-rl]">
          For businesses
        </span>
      </aside>

      <div className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-xl">
          <ProgressBar current={step} total={quizSteps.length} />
          <div className="mt-12">{renderStep()}</div>

          {step > 0 && (
            <div className="mt-10">
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                ← Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
