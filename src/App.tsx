import { useMemo, useState } from 'react';
import { Landing } from './components/Landing';
import { QuizFunnel } from './components/Quiz/QuizFunnel';
import { MatchResults } from './components/Matches/MatchResults';
import { MatchDetail } from './components/Matches/MatchDetail';
import { DealRoom } from './components/Deal/DealRoom';
import { MatchingScreen } from './components/Matches/MatchingScreen';
import { ProfileBuilder } from './components/Club/ProfileBuilder';
import { LiveProfile } from './components/Club/LiveProfile';
import { matchSponsorToProfiles } from './lib/matching';
import { profiles as seedProfiles } from './data/profiles';
import { profileFromDraft } from './lib/draftToProfile';
import type { Match, Priority, Profile, ProfileDraft, SponsorAnswers } from './lib/types';

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

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [answers, setAnswers] = useState<SponsorAnswers | null>(null);
  const [selected, setSelected] = useState<Match | null>(null);
  const [clubDraft, setClubDraft] = useState<ProfileDraft | null>(null);
  // The supply side is live state: a club that self-lists during the demo
  // becomes discoverable to sponsors for the rest of the session.
  const [pool, setPool] = useState<Profile[]>(seedProfiles);

  const matches = useMemo(
    () => (answers ? matchSponsorToProfiles(answers, pool) : []),
    [answers, pool],
  );

  function runSponsor(next: SponsorAnswers) {
    setAnswers(next);
    setScreen('matching');
  }

  function goHome() {
    setAnswers(null);
    setSelected(null);
    setClubDraft(null);
    setScreen('landing');
  }

  return (
    // Flex shell so full-height screens (the funnels) can just claim flex-1
    // instead of guessing the header's height in a calc().
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
          onClubSeed={(draft) => {
            setClubDraft(draft);
            // Quick-starts must enter the pool too, or the "you're live" claim
            // is false on the very path most likely to be demoed.
            setPool((current) => [...current, profileFromDraft(draft, current.length)]);
            setScreen('club-live');
          }}
        />
      )}

      {screen === 'quiz' && <QuizFunnel onComplete={runSponsor} />}

      {screen === 'matching' && (
        <MatchingScreen poolSize={pool.length} onDone={() => setScreen('results')} />
      )}

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
          onComplete={(draft) => {
            setClubDraft(draft);
            setPool((current) => [...current, profileFromDraft(draft, current.length)]);
            setScreen('club-live');
          }}
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
