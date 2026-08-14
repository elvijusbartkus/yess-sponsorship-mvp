import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Landing } from './components/Landing';
import { QuizFunnel } from './components/Quiz/QuizFunnel';
import { MatchResults } from './components/Matches/MatchResults';
import { MatchDetail } from './components/Matches/MatchDetail';
import { DealRoom } from './components/Deal/DealRoom';
import { ContractSign } from './components/Deal/ContractSign';
import { DeliverablesTracker } from './components/Deal/DeliverablesTracker';
import { MatchingScreen } from './components/Matches/MatchingScreen';
import { SponsorSignup } from './components/Onboarding/SponsorSignup';
import { MembershipDialog } from './components/Membership/MembershipDialog';
import { Pricing } from './components/Pricing';
import { ProfileBuilder } from './components/Club/ProfileBuilder';
import { LiveProfile } from './components/Club/LiveProfile';
import { BrowseList } from './components/Browse/BrowseList';
import { createProfile, fetchMatches, fetchProfiles } from './lib/api';
import type {
  ActivationType,
  ContractRecord,
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
  | 'deal'
  | 'contract'
  | 'deliverables'
  | 'club-builder'
  | 'club-live'
  | 'browse';

/** Which side of the marketplace a screen belongs to — shown in the header so
 * nobody has to guess whether they're looking at the sponsor or the club side. */
type Role = 'sponsor' | 'club' | null;

const ROLE_BY_SCREEN: Record<Screen, Role> = {
  landing: null,
  pricing: null,
  browse: null,
  'sponsor-signup': 'sponsor',
  quiz: 'sponsor',
  matching: 'sponsor',
  results: 'sponsor',
  detail: 'sponsor',
  deal: 'sponsor',
  contract: 'sponsor',
  deliverables: 'sponsor',
  'club-builder': 'club',
  'club-live': 'club',
};

function RoleBadge({ role }: { role: Role }) {
  if (!role) return null;
  const isSponsor = role === 'sponsor';
  return (
    <span
      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
        isSponsor ? 'bg-flare-50 text-flare-700' : 'bg-gain-50 text-gain-700'
      }`}
    >
      {isSponsor ? 'Sponsor view' : 'Club & athlete view'}
    </span>
  );
}

function Header({
  role,
  onHome,
  onPricing,
  onBrowse,
}: {
  role: Role;
  onHome: () => void;
  onPricing: () => void;
  onBrowse: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-paper-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <button onClick={onHome} className="group flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink-950 font-display text-sm font-bold text-flare-500 transition-colors group-hover:bg-flare-500 group-hover:text-white">
              S
            </span>
            <span className="font-display text-[15px] font-bold tracking-tight text-ink-950">
              Sponsorship Marketplace
            </span>
          </button>
          <RoleBadge role={role} />
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={onBrowse}
            className="font-display text-sm font-medium text-ink-500 transition-colors hover:text-flare-500"
          >
            Browse
          </button>
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
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <div className="rounded-lg bg-white p-6 ring-1 ring-inset ring-paper-line">
        <h2 className="display text-3xl text-ink-950">Couldn't reach the marketplace</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{message}</p>
        <button
          onClick={onRetry}
          className="mt-6 rounded-md bg-ink-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-flare-500"
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
  const [dealValue, setDealValue] = useState(0);
  const [contract, setContract] = useState<ContractRecord | null>(null);
  const [clubDraft, setClubDraft] = useState<ProfileDraft | null>(null);
  const [account, setAccount] = useState<SponsorAccount | null>(null);
  const [poolSize, setPoolSize] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [membershipDialogOpen, setMembershipDialogOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  /**
   * The only place membership is ever asked about — called from the two
   * actions that actually cost something (Contact, Propose a deal). Shown as
   * a popup, never a screen you land on proactively.
   */
  function requireMembership(action: () => void) {
    if (account?.membershipActive) {
      action();
      return;
    }
    pendingAction.current = action;
    setMembershipDialogOpen(true);
  }

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
    setContract(null);
    setScreen('landing');
  }

  function publishProfile(draft: ProfileDraft) {
    setClubDraft(draft);
    setScreen('club-live');
    createProfile(draft)
      .then(() => loadPool())
      .catch((e: Error) => setError(e.message));
  }

  function renderScreen() {
    switch (screen) {
      case 'landing':
        return (
          <Landing
            onSponsorStart={() => setScreen(account ? 'quiz' : 'sponsor-signup')}
            onClubStart={() => {
              setClubDraft(null);
              setScreen('club-builder');
            }}
            onPricing={() => setScreen('pricing')}
            onBrowse={() => setScreen('browse')}
          />
        );

      case 'pricing':
        return <Pricing onBack={() => setScreen('landing')} />;

      case 'browse':
        return <BrowseList onBack={goHome} />;

      case 'sponsor-signup':
        return (
          <SponsorSignup
            onComplete={(next) => {
              setAccount(next);
              setScreen('quiz');
            }}
            onCancel={() => setScreen('landing')}
          />
        );

      case 'quiz':
        return (
          <QuizFunnel
            onComplete={runSponsor}
            presetCountry={account?.country}
            onCancel={() => setScreen(account ? 'sponsor-signup' : 'landing')}
          />
        );

      case 'matching':
        return (
          <MatchingScreen
            poolSize={poolSize}
            onDone={() => {
              animationDone.current = true;
              showResultsWhenBothReady();
            }}
          />
        );

      case 'results':
        if (!answers) return null;
        if (error) return <ErrorBanner message={error} onRetry={() => runSponsor(answers)} />;
        return (
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
            onNoteChange={(note) => refine({ note })}
          />
        );

      case 'detail':
        if (!selected) return null;
        return (
          <MatchDetail
            match={selected}
            onBack={() => setScreen('results')}
            onOpenDeal={() => setScreen('deal')}
            requireMembership={requireMembership}
          />
        );

      case 'deal':
        if (!selected || !answers) return null;
        return (
          <DealRoom
            match={selected}
            answers={answers}
            onBack={() => setScreen('detail')}
            onAgree={(value) => {
              setDealValue(value);
              setScreen('contract');
            }}
          />
        );

      case 'contract':
        if (!selected) return null;
        return (
          <ContractSign
            match={selected}
            sponsorName={account?.company ?? 'Your company'}
            dealValue={dealValue}
            onBack={() => setScreen('deal')}
            onSigned={(record) => {
              setContract(record);
              setScreen('deliverables');
            }}
          />
        );

      case 'deliverables':
        if (!selected || !contract) return null;
        return (
          <DeliverablesTracker
            match={selected}
            sponsorName={account?.company ?? 'Your company'}
            contract={contract}
            onBack={() => setScreen('contract')}
            onHome={() => setScreen('results')}
          />
        );

      case 'club-builder':
        return (
          <ProfileBuilder initial={clubDraft ?? undefined} onCancel={goHome} onComplete={publishProfile} />
        );

      case 'club-live':
        if (!clubDraft) return null;
        return <LiveProfile draft={clubDraft} onEdit={() => setScreen('club-builder')} onHome={goHome} />;

      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        role={ROLE_BY_SCREEN[screen]}
        onHome={goHome}
        onPricing={() => setScreen('pricing')}
        onBrowse={() => setScreen('browse')}
      />

      <main className="flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-1 flex-col"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      <MembershipDialog
        open={membershipDialogOpen}
        onOpenChange={setMembershipDialogOpen}
        onStart={() => {
          setAccount((current) => (current ? { ...current, membershipActive: true } : current));
          setMembershipDialogOpen(false);
          pendingAction.current?.();
          pendingAction.current = null;
        }}
      />
    </div>
  );
}
