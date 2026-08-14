import { useMemo, useState } from 'react';
import { QuizFunnel } from './components/Quiz/QuizFunnel';
import { MatchResults } from './components/Matches/MatchResults';
import { MatchDetail } from './components/Matches/MatchDetail';
import { Button } from './components/common/Button';
import { matchSponsorToProfiles } from './lib/matching';
import { profiles } from './data/profiles';
import { personas } from './data/personas';
import type { Match, SponsorAnswers } from './lib/types';

type Screen = 'start' | 'quiz' | 'results' | 'detail';

function Header({ onHome }: { onHome: () => void }) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <button onClick={onHome} className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500 text-sm font-bold text-white">
            S
          </span>
          <span className="text-sm font-semibold tracking-tight text-ink-900">
            Sponsorship Marketplace
          </span>
        </button>
        <span className="hidden text-xs text-ink-400 sm:block">
          EOK × YESS · Tallinn 2026
        </span>
      </div>
    </header>
  );
}

function StartScreen({
  onStartQuiz,
  onPersona,
}: {
  onStartQuiz: () => void;
  onPersona: (answers: SponsorAnswers) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-500">
        For sponsors
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
        Find the sport worth backing —
        <span className="text-accent-500"> and what it actually costs you after tax.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-500">
        Answer five questions. We match you to clubs and athletes across the Baltics on audience,
        region, budget and goal — and price every match against the tax relief you are entitled to
        and probably are not using.
      </p>

      <div className="mt-8">
        <Button size="lg" onClick={onStartQuiz}>
          Find my matches
        </Button>
      </div>

      <div className="mt-14 border-t border-slate-200 pt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
          Or jump in as a sample sponsor
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => onPersona(persona.answers)}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-lift"
            >
              <p className="text-sm font-semibold text-ink-900">{persona.label}</p>
              <p className="mt-1 text-xs text-ink-400">{persona.blurb}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [answers, setAnswers] = useState<SponsorAnswers | null>(null);
  const [selected, setSelected] = useState<Match | null>(null);

  const matches = useMemo(
    () => (answers ? matchSponsorToProfiles(answers, profiles) : []),
    [answers],
  );

  function runWith(next: SponsorAnswers) {
    setAnswers(next);
    setScreen('results');
  }

  function reset() {
    setAnswers(null);
    setSelected(null);
    setScreen('start');
  }

  return (
    <div className="min-h-full">
      <Header onHome={reset} />

      {screen === 'start' && (
        <StartScreen onStartQuiz={() => setScreen('quiz')} onPersona={runWith} />
      )}

      {screen === 'quiz' && <QuizFunnel onComplete={runWith} />}

      {screen === 'results' && answers && (
        <MatchResults
          matches={matches}
          answers={answers}
          onSelect={(match) => {
            setSelected(match);
            setScreen('detail');
          }}
          onRestart={reset}
        />
      )}

      {screen === 'detail' && selected && answers && (
        <MatchDetail
          match={selected}
          answers={answers}
          onBack={() => setScreen('results')}
        />
      )}
    </div>
  );
}
