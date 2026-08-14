import { useState } from 'react';
import { Badge, VerifiedBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import type { Match, SponsorAnswers } from '../../lib/types';

const COUNTRY_LABEL: Record<string, string> = { EE: 'Estonia', LV: 'Latvia', LT: 'Lithuania' };

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink-900">{value}</p>
    </div>
  );
}

export function MatchDetail({
  match,
  answers,
  onBack,
}: {
  match: Match;
  answers: SponsorAnswers;
  onBack: () => void;
}) {
  const [connected, setConnected] = useState(false);
  const { profile, taxBenefit } = match;
  const hasEnhancedRelief = profile.taxStatus.benefit.kind !== 'none';

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <Button variant="ghost" onClick={onBack}>
        ← Back to matches
      </Button>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-ink-900">{profile.name}</h1>
            <VerifiedBadge verified={match.verifiedBadge} />
          </div>
          <p className="mt-2 text-sm text-ink-400">
            {profile.type === 'club' ? 'Club' : 'Athlete'} · {profile.sport} · {profile.region},{' '}
            {COUNTRY_LABEL[profile.country]}
          </p>
        </div>
        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-accent-50 ring-1 ring-inset ring-accent-100">
          <span className="text-xl font-semibold leading-none text-accent-700">{match.score}</span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-500">
            fit
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-700">{profile.results}</p>

      {/* The wedge, in full */}
      <section
        className={`mt-8 rounded-2xl p-5 ${
          hasEnhancedRelief
            ? 'bg-gain-50 ring-1 ring-inset ring-gain-100'
            : 'bg-slate-50 ring-1 ring-inset ring-slate-200'
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
          Your tax position
        </p>
        <p
          className={`mt-2 text-xl font-semibold ${
            hasEnhancedRelief ? 'text-gain-700' : 'text-ink-800'
          }`}
        >
          {taxBenefit.headline}
        </p>
        <p className={`mt-1 text-sm ${hasEnhancedRelief ? 'text-gain-600' : 'text-ink-500'}`}>
          {taxBenefit.subline}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs text-ink-400">You sponsor</p>
            <p className="text-sm font-semibold text-ink-900">{formatEur(answers.budget)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-400">Off taxable profit</p>
            <p className="text-sm font-semibold text-ink-900">
              {formatEur(taxBenefit.deductibleAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-400">Cash effect</p>
            <p className="text-sm font-semibold text-ink-900">
              {taxBenefit.cashSaving > 0 ? formatEur(taxBenefit.cashSaving) : '—'}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-ink-400">{profile.taxStatus.note}</p>
        <p className="mt-1 text-xs text-ink-300">{taxBenefit.caveat}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">
          Why we matched you
        </h2>
        <ul className="mt-3 space-y-2">
          {match.reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-2 text-sm text-ink-700">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mt-0.5 h-4 w-4 shrink-0 text-accent-500"
              >
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              {reason}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Audience</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Matchday"
            value={profile.reach.matchAttendance ? profile.reach.matchAttendance.toLocaleString('en-US') : '—'}
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

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">
          What you get
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {profile.activation.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Typical deal</p>
          <p className="mt-1 text-sm font-semibold text-ink-900">
            {formatEur(profile.dealRange[0])} – {formatEur(profile.dealRange[1])}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
            Current sponsors
          </p>
          <p className="mt-1 text-sm font-semibold text-ink-900">
            {profile.currentSponsors.length ? profile.currentSponsors.join(', ') : 'None yet'}
          </p>
        </div>
      </section>

      <div className="mt-10 border-t border-slate-200 pt-6">
        {connected ? (
          <div className="rounded-xl border border-gain-100 bg-gain-50 px-5 py-4">
            <p className="font-semibold text-gain-700">Request sent to {profile.name}</p>
            <p className="mt-1 text-sm text-gain-600">
              They typically respond within 48 hours. We handle the paperwork and confirm the tax
              treatment before anything is signed.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={() => setConnected(true)}>
              Connect with {profile.name}
            </Button>
            <span className="text-xs text-ink-400">
              Free to connect. We take a commission only when a deal closes.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
