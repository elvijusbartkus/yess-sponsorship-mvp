import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import { COUNTRY_LABEL } from '../../lib/matching';
import { demandSignal } from '../../data/clubFlow';
import type { ProfileDraft } from '../../lib/types';

export function LiveProfile({
  draft,
  onEdit,
  onHome,
}: {
  draft: ProfileDraft;
  onEdit: () => void;
  onHome: () => void;
}) {
  const totalReach = draft.audienceSize + draft.instagramFollowers;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <div className="rounded-2xl border border-gain-100 bg-gain-50 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gain-500 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gain-500" />
          </span>
          <p className="font-semibold text-gain-700">You're live</p>
        </div>
        <p className="mt-1 text-sm text-gain-600">
          Sponsors searching {COUNTRY_LABEL[draft.country]} can now discover and back you. Listing is
          free, and you are never charged to be contacted.
        </p>
      </div>

      <h1 className="mt-8 text-2xl font-semibold tracking-tight text-ink-900">
        How sponsors see you
      </h1>

      {/* Deliberately the same card language as the sponsor side. */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-ink-900">{draft.name}</h2>
              <Badge tone="muted">Self-reported</Badge>
            </div>
            <p className="mt-1 text-sm text-ink-400">
              {draft.sport} · {draft.region}, {COUNTRY_LABEL[draft.country]}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 text-ink-400 ring-1 ring-inset ring-slate-200">
            <span className="text-base font-semibold leading-none">—</span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wide">fit</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <div>
            <span className="text-2xl font-semibold tracking-tight text-ink-900">
              {totalReach.toLocaleString('en-US')}
            </span>
            <span className="ml-1.5 text-sm text-ink-400">people reached</span>
          </div>
          <div className="text-sm text-ink-400">
            Typical deal {formatEur(draft.dealRange[0])} – {formatEur(draft.dealRange[1])}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge>{draft.type}</Badge>
          <Badge>{draft.sport}</Badge>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
            What a sponsor gets
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {draft.activation.map((a) => (
              <Badge key={a} tone="accent">
                {a}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-ink-400">
        Your fit score is calculated per sponsor, so it only appears once someone searches. Add
        verified attendance later to raise how you rank.
      </p>

      {/* The demand side is real — show it. */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">
          Who's looking right now
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-2xl font-semibold text-ink-900">{demandSignal.activeSponsors}</p>
            <p className="text-xs text-ink-400">active sponsors in your market</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-2xl font-semibold text-ink-900">{demandSignal.searchingThisWeek}</p>
            <p className="text-xs text-ink-400">searched this week</p>
          </div>
        </div>

        <ul className="mt-3 space-y-2">
          {demandSignal.recent.map((r) => (
            <li
              key={r.name}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <span className="font-medium text-ink-900">{r.name}</span>
              <span className="text-ink-400">looking for {r.detail}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-ink-400">
          Illustrative demand data for the demo.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <Button variant="secondary" onClick={onEdit}>
          Edit profile
        </Button>
        <Button variant="ghost" onClick={onHome}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
