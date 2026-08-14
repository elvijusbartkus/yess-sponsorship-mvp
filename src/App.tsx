import { useCallback, useEffect, useRef, useState } from 'react';
import { Landing } from './components/Landing';
import { QuizFunnel } from './components/Quiz/QuizFunnel';
import { MatchResults } from './components/Matches/MatchResults';
import { MatchDetail } from './components/Matches/MatchDetail';
import { DealRoom } from './components/Deal/DealRoom';
import { MatchingScreen } from './components/Matches/MatchingScreen';
import { ProfileBuilder } from './components/Club/ProfileBuilder';
import { LiveProfile } from './components/Club/LiveProfile';
import { createProfile, fetchMatches, fetchProfiles } from './lib/api';
import type { Match, Priority, ProfileDraft, SponsorAnswers } from './lib/types';

type Screen =
  | 'landing'
  | 'quiz'
  | 'matching'
  | 'results'
  | 'detail'
  | 'deal'
  | 'club-builder'
  | 'club-live';

function Header({ onHome }: { onHome: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-paper-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <button onClick={onHome} className="group flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-950 font-display text-sm font-bold text-flare-500 transition-colors group-hover:bg-flare-500 group-hover:text-white">
            S
          </span>
          <span className="font-display text-[15px] font-bold tracking-tight text-ink-950">
            Sponsorship Marketplace
          </span>
        </button>
        <span className="eyebrow hidden text-ink-400 sm:block">EOK × YESS · Tallinn 2026</span>
      </div>
    </header>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16">
      <div className="rounded-3xl bg-white p-8 ring-1 ring-inset ring-paper-line">
        <h2 className="display text-3xl text-ink-950">Couldn't reach the marketplace</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{message}</p>
        <button
          onClick={onRetry}
          className="mt-6 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-flare-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [answers, setAnswers] = useState<SponsorAnswers | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selected, setSelected] = useState<Match | null>(null);
  const [clubDraft, setClubDraft] = useState<ProfileDraft | null>(null);
  const [poolSize, setPoolSize] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // The matching screen and the request run concurrently; whichever finishes
  // last decides when results appear, so the animation is never cut short and
  // a slow API never shows an empty screen.
  const matchesReady = useRef(false);
  const animationDone = useRef(false);

  const loadPool = useCallback(() => {
    fetchProfiles()
      .then(({ profiles }) => setPoolSize(profiles.length))
      .catch(() => setPoolSize(0));
  }, []);

  useEffect(loadPool, [loadPool]);

  function showResultsWhenBothReady() {
    if (matchesReady.current && animationDone.current) setScreen('results');
  }

  const runSponsor = useCallback((next: SponsorAnswers) => {
    setAnswers(next);
    setError(null);
    setMatches([]);
    matchesReady.current = false;
    animationDone.current = false;
    setScreen('matching');

    fetchMatches(next)
      .then(({ matches: found }) => {
        setMatches(found);
        matchesReady.current = true;
        showResultsWhenBothReady();
      })
      .catch((e: Error) => {
        setError(e.message);
        setScreen('results');
      });
  }, []);

  function rerank(priority: Priority) {
    if (!answers) return;
    const next = { ...answers, priority };
    setAnswers(next);
    fetchMatches(next)
      .then(({ matches: found }) => setMatches(found))
      .catch((e: Error) => setError(e.message));
  }

  function goHome() {
    setAnswers(null);
    setSelected(null);
    setClubDraft(null);
    setMatches([]);
    setError(null);
    setScreen('landing');
  }

  function publishProfile(draft: ProfileDraft) {
    setClubDraft(draft);
    setScreen('club-live');
    createProfile(draft)
      .then(() => loadPool())
      .catch((e: Error) => setError(e.message));
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header onHome={goHome} />

      <main className="flex flex-1 flex-col">
        {screen === 'landing' && (
          <Landing
            onSponsorStart={() => setScreen('quiz')}
            onClubStart={() => {
              setClubDraft(null);
              setScreen('club-builder');
            }}
            onPersona={runSponsor}
            onClubSeed={publishProfile}
          />
        )}

        {screen === 'quiz' && <QuizFunnel onComplete={runSponsor} />}

        {screen === 'matching' && (
          <MatchingScreen
            poolSize={poolSize}
            onDone={() => {
              animationDone.current = true;
              showResultsWhenBothReady();
            }}
          />
        )}

        {screen === 'results' &&
          answers &&
          (error ? (
            <ErrorBanner message={error} onRetry={() => runSponsor(answers)} />
          ) : (
            <MatchResults
              matches={matches}
              answers={answers}
              onSelect={(match) => {
                setSelected(match);
                setScreen('detail');
              }}
              onRestart={goHome}
              onPriorityChange={rerank}
            />
          ))}

        {screen === 'detail' && selected && answers && (
          <MatchDetail
            match={selected}
            answers={answers}
            onBack={() => setScreen('results')}
            onOpenDeal={() => setScreen('deal')}
          />
        )}

        {screen === 'deal' && selected && answers && (
          <DealRoom
            match={selected}
            answers={answers}
            onBack={() => setScreen('detail')}
            onHome={() => setScreen('results')}
          />
        )}

        {screen === 'club-builder' && (
          <ProfileBuilder
            initial={clubDraft ?? undefined}
            onCancel={goHome}
            onComplete={publishProfile}
          />
        )}

        {screen === 'club-live' && clubDraft && (
          <LiveProfile
            draft={clubDraft}
            onEdit={() => setScreen('club-builder')}
            onHome={goHome}
            onSearchAsSponsor={() => setScreen('quiz')}
          />
        )}
      </main>
    </div>
  );
}
