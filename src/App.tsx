import { useMemo, useState } from 'react';
import { Landing } from './components/Landing';
import { QuizFunnel } from './components/Quiz/QuizFunnel';
import { MatchResults } from './components/Matches/MatchResults';
import { MatchDetail } from './components/Matches/MatchDetail';
import { ProfileBuilder } from './components/Club/ProfileBuilder';
import { LiveProfile } from './components/Club/LiveProfile';
import { matchSponsorToProfiles } from './lib/matching';
import { profiles } from './data/profiles';
import type { Match, Priority, ProfileDraft, SponsorAnswers } from './lib/types';

type Screen =
  | 'landing'
  | 'quiz'
  | 'results'
  | 'detail'
  | 'club-builder'
  | 'club-live';

function Header({ onHome }: { onHome: () => void }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <button onClick={onHome} className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500 text-sm font-bold text-white">
            S
          </span>
          <span className="text-sm font-semibold tracking-tight text-ink-900">
            Sponsorship Marketplace
          </span>
        </button>
        <span className="hidden text-xs text-ink-400 sm:block">EOK × YESS · Tallinn 2026</span>
      </div>
    </header>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [answers, setAnswers] = useState<SponsorAnswers | null>(null);
  const [selected, setSelected] = useState<Match | null>(null);
  const [clubDraft, setClubDraft] = useState<ProfileDraft | null>(null);

  const matches = useMemo(
    () => (answers ? matchSponsorToProfiles(answers, profiles) : []),
    [answers],
  );

  function runSponsor(next: SponsorAnswers) {
    setAnswers(next);
    setScreen('results');
  }

  function goHome() {
    setAnswers(null);
    setSelected(null);
    setClubDraft(null);
    setScreen('landing');
  }

  return (
    <div className="min-h-full">
      <Header onHome={goHome} />

      {screen === 'landing' && (
        <Landing
          onSponsorStart={() => setScreen('quiz')}
          onClubStart={() => {
            setClubDraft(null);
            setScreen('club-builder');
          }}
          onPersona={runSponsor}
          onClubSeed={(draft) => {
            setClubDraft(draft);
            setScreen('club-live');
          }}
        />
      )}

      {screen === 'quiz' && <QuizFunnel onComplete={runSponsor} />}

      {screen === 'results' && answers && (
        <MatchResults
          matches={matches}
          answers={answers}
          onSelect={(match) => {
            setSelected(match);
            setScreen('detail');
          }}
          onRestart={goHome}
          onPriorityChange={(priority: Priority) => setAnswers({ ...answers, priority })}
        />
      )}

      {screen === 'detail' && selected && answers && (
        <MatchDetail match={selected} answers={answers} onBack={() => setScreen('results')} />
      )}

      {screen === 'club-builder' && (
        <ProfileBuilder
          initial={clubDraft ?? undefined}
          onCancel={goHome}
          onComplete={(draft) => {
            setClubDraft(draft);
            setScreen('club-live');
          }}
        />
      )}

      {screen === 'club-live' && clubDraft && (
        <LiveProfile
          draft={clubDraft}
          onEdit={() => setScreen('club-builder')}
          onHome={goHome}
        />
      )}
    </div>
  );
}
