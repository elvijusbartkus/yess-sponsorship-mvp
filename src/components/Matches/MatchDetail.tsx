import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Badge, CorroboratedBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import { COUNTRY_LABEL } from '../../lib/matching';
import type { Match } from '../../lib/types';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-4 py-4 ring-1 ring-inset ring-paper-line">
      <p className="eyebrow text-ink-400">{label}</p>
      <p className="display mt-1.5 text-2xl tabular-nums text-ink-950">{value}</p>
    </div>
  );
}

export function MatchDetail({
  match,
  onBack,
  onOpenDeal,
}: {
  match: Match;
  onBack: () => void;
  onOpenDeal: () => void;
}) {
  const [connected, setConnected] = useState(false);
  const { profile, taxBenefit } = match;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
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
        <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-ink-950">
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

      <section className="mt-10">
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
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.demographics.map((d) => (
            <Badge key={d}>{d}</Badge>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="eyebrow text-ink-400">How we know</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
          {profile.corroboration
            ? `Claimed ${profile.corroboration.claimedAudience.toLocaleString('en-US')}, backed by ${profile.corroboration.socialReach.toLocaleString('en-US')} public followers and ${profile.corroboration.pressMentions} press mentions a year.`
            : 'Self-reported by the club — not yet checked against public data.'}
        </p>
        {match.consistencyFlag && (
          <p className="mt-2 text-[13px] text-flare-700">{match.consistencyFlag}</p>
        )}
      </section>

      <section className="mt-10">
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

      <section className="mt-10 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white px-4 py-4 ring-1 ring-inset ring-paper-line">
          <p className="eyebrow text-ink-400">Past deals in this range</p>
          <p className="mt-1.5 font-display text-lg font-medium text-ink-950">
            {formatEur(profile.dealRange[0])} – {formatEur(profile.dealRange[1])}
          </p>
          <p className="mt-1 text-xs text-ink-400">A guide, not a price — you propose the real number next.</p>
        </div>
        <div className="rounded-lg bg-white px-4 py-4 ring-1 ring-inset ring-paper-line">
          <p className="eyebrow text-ink-400">Current sponsors</p>
          <p className="mt-1.5 font-display text-lg font-medium text-ink-950">
            {profile.currentSponsors.length ? profile.currentSponsors.join(', ') : 'None yet'}
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="eyebrow text-ink-400">Tax</h2>
        <p
          className={`mt-2 text-[15px] ${taxBenefit.applies ? 'text-flare-700' : 'text-ink-500'}`}
        >
          {taxBenefit.line}
        </p>
      </section>

      <div className="mt-12 border-t border-paper-line pt-8">
        {connected ? (
          <div className="rounded-lg bg-gain-50 px-6 py-5 ring-1 ring-inset ring-gain-100">
            <p className="font-display text-xl font-bold tracking-tight text-gain-700">
              Request sent to {profile.name}
            </p>
            <p className="mt-1 text-sm text-gain-600">
              They typically respond within 48 hours. Nothing is charged for connecting.
            </p>
            <div className="mt-5">
              <Button onClick={onOpenDeal}>
                Propose a deal <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={() => setConnected(true)}>
              Contact {profile.name}
            </Button>
            <span className="text-xs text-ink-400">{profile.name} is never charged.</span>
          </div>
        )}
      </div>
    </div>
  );
}
