import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Badge, CorroboratedBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import { COUNTRY_LABEL } from '../../lib/matching';
import type { Match } from '../../lib/types';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-4 py-4 ring-1 ring-inset ring-paper-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
      <p className="eyebrow text-ink-400">{label}</p>
      <p className="display mt-1.5 text-2xl tabular-nums text-ink-950">{value}</p>
    </div>
  );
}

/**
 * Trimmed to what a sponsor actually needs to decide: is this a fit, what do
 * they get, what's a normal deal size here. Proposing a deal is the primary
 * action — it doesn't wait behind a fake "message sent" step first.
 */
export function MatchDetail({
  match,
  onBack,
  onOpenDeal,
  requireMembership,
}: {
  match: Match;
  onBack: () => void;
  onOpenDeal: () => void;
  /** Gates an action behind the membership popup — shown only here, never before. */
  requireMembership: (action: () => void) => void;
}) {
  const [contacted, setContacted] = useState(false);
  const { profile, taxBenefit } = match;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <Button variant="ghost" onClick={onBack}>
        ← Back to matches
      </Button>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="display text-4xl leading-tight text-ink-950 sm:text-5xl">{profile.name}</h1>
            <CorroboratedBadge corroborated={match.corroboratedBadge} />
          </div>
          <p className="mt-2.5 text-sm text-ink-500">
            {profile.type === 'club' ? 'Club' : 'Athlete'} · {profile.sport} · {profile.region},{' '}
            {COUNTRY_LABEL[profile.country]}
          </p>
        </div>
        <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-ink-950 ring-hairline-dark">
          <span className="display text-3xl leading-none text-flare-500">{match.score}</span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-400">
            fit score
          </span>
        </div>
      </div>

      {match.caution && (
        <p className="mt-5 rounded-lg bg-paper-dim px-5 py-4 text-sm text-ink-600">
          {match.caution}
        </p>
      )}

      <section className="mt-8">
        <h2 className="eyebrow text-ink-400">Why this is a fit</h2>
        <ul className="mt-3 space-y-2">
          {match.reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-flare-500" />
              {reason}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="eyebrow text-ink-400">Audience</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Matchday"
            value={
              profile.reach.matchAttendance
                ? profile.reach.matchAttendance.toLocaleString('en-US')
                : '—'
            }
          />
          <Stat label="Instagram" value={profile.reach.instagramFollowers.toLocaleString('en-US')} />
          <Stat label="Facebook" value={profile.reach.facebookFans.toLocaleString('en-US')} />
          <Stat label="Press / yr" value={String(profile.reach.pressMentions)} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {profile.demographics.map((d) => (
            <Badge key={d}>{d}</Badge>
          ))}
          <span className="text-xs text-ink-400">
            {profile.corroboration
              ? `Backed by ${profile.corroboration.socialReach.toLocaleString('en-US')} public followers.`
              : 'Self-reported — not yet checked against public data.'}
          </span>
        </div>
        {match.consistencyFlag && (
          <p className="mt-2 text-[13px] text-flare-700">{match.consistencyFlag}</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="eyebrow text-ink-400">What you get</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {profile.activation.map((item) => (
            <li
              key={item}
              className="rounded-md bg-white px-4 py-3 text-sm text-ink-700 ring-1 ring-inset ring-paper-line"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white px-4 py-4 ring-1 ring-inset ring-paper-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
          <p className="eyebrow text-ink-400">Past deals in this range</p>
          <p className="mt-1.5 font-display text-lg font-medium text-ink-950">
            {formatEur(profile.dealRange[0])} – {formatEur(profile.dealRange[1])}
          </p>
          <p className="mt-1 text-xs text-ink-400">A guide, not a price — you propose the real number next.</p>
        </div>
        <div className="rounded-lg bg-white px-4 py-4 ring-1 ring-inset ring-paper-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
          <p className="eyebrow text-ink-400">Current sponsors</p>
          <p className="mt-1.5 font-display text-lg font-medium text-ink-950">
            {profile.currentSponsors.length ? profile.currentSponsors.join(', ') : 'None yet'}
          </p>
          {taxBenefit.applies && (
            <p className="mt-2 text-xs text-flare-700">{taxBenefit.tag}</p>
          )}
        </div>
      </section>

      <div className="mt-9 border-t border-paper-line pt-8">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => requireMembership(onOpenDeal)}>
            Propose a deal <ArrowRight className="h-4 w-4" />
          </Button>
          {!contacted ? (
            <Button
              variant="secondary"
              onClick={() => requireMembership(() => setContacted(true))}
            >
              Contact {profile.name} first
            </Button>
          ) : (
            <span className="text-xs text-gain-700">Message sent to {profile.name}.</span>
          )}
        </div>
      </div>
    </div>
  );
}
