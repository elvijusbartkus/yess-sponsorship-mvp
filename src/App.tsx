import { useCallback, useEffect, useRef, useState } from 'react';
import { Landing } from './components/Landing';
import { QuizFunnel } from './components/Quiz/QuizFunnel';
import { MatchResults } from './components/Matches/MatchResults';
import { MatchDetail } from './components/Matches/MatchDetail';
import { DealRoom } from './components/Deal/DealRoom';
import { MatchingScreen } from './components/Matches/MatchingScreen';
import { SponsorSignup } from './components/Onboarding/SponsorSignup';
import { MembershipGate } from './components/Membership/MembershipGate';
import { Pricing } from './components/Pricing';
import { ProfileBuilder } from './components/Club/ProfileBuilder';
import { LiveProfile } from './components/Club/LiveProfile';
import { createProfile, fetchMatches, fetchProfiles } from './lib/api';
import type {
  ActivationType,
  Match,
  Priority,
  ProfileDraft,
  SponsorAccount,
  SponsorAnswers,
} from './lib/types';

type Screen =
  | 'landing'
  | 'pricing'
  | 'sponsor-signup'
  | 'quiz'
  | 'matching'
  | 'results'
  | 'detail'
  | 'membership'
  | 'deal'
  | 'club-builder'
  | 'club-live';

function Header({ onHome, onPricing }: { onHome: () => void; onPricing: () => void }) {
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
        <div className="flex items-center gap-5">
          <button
            onClick={onPricing}
            className="font-display text-sm font-medium text-ink-500 transition-colors hover:text-flare-500"
          >
            Pricing
          </button>
        </div>
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
  const [account, setAccount] = useState<SponsorAccount | null>(null);
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

  /** Re-runs the match with a tweaked answer, without leaving the results. */
  function refine(patch: Partial<SponsorAnswers>) {
    if (!answers) return;
    const next = { ...answers, ...patch };
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
      <Header onHome={goHome} onPricing={() => setScreen('pricing')} />

      <main className="flex flex-1 flex-col">
        {screen === 'landing' && (
          <Landing
            onSponsorStart={() => setScreen(account ? 'quiz' : 'sponsor-signup')}
            onClubStart={() => {
              setClubDraft(null);
              setScreen('club-builder');
            }}
            onPricing={() => setScreen('pricing')}
          />
        )}

        {screen === 'pricing' && <Pricing onBack={() => setScreen('landing')} />}

        {screen === 'sponsor-signup' && (
          <SponsorSignup
            onComplete={(next) => {
              setAccount(next);
              setScreen('quiz');
            }}
            onCancel={() => setScreen('landing')}
          />
        )}

        {screen === 'quiz' && (
          <QuizFunnel
            onComplete={runSponsor}
            presetCountry={account?.country}
            onCancel={() => setScreen(account ? 'sponsor-signup' : 'landing')}
          />
        )}

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
              onPriorityChange={(priority: Priority) => refine({ priority })}
              onWantsChange={(wants: ActivationType | 'any') => refine({ wants })}
            />
          ))}

        {screen === 'detail' && selected && (
          <MatchDetail
            match={selected}
            onBack={() => setScreen('results')}
            onOpenDeal={() => setScreen('deal')}
            membershipActive={account?.membershipActive ?? false}
            onRequireMembership={() => setScreen('membership')}
          />
        )}

        {screen === 'membership' && selected && (
          <MembershipGate
            profile={selected.profile}
            onBack={() => setScreen('detail')}
            onStart={() => {
              // Straight to the deal room: the gate and the commission screen
              // are the two money moments, and nothing useful sits between
              // them. Saves two clicks in a sixty-second demo.
              setAccount((current) =>
                current ? { ...current, membershipActive: true } : current,
              );
              setScreen('deal');
            }}
          />
        )}

        {screen === 'deal' && selected && answers && (
          <DealRoom
            match={selected}
            answers={answers}
            sponsorName={account?.company ?? 'Your company'}
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
