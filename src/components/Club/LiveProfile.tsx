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
  onSearchAsSponsor,
}: {
  draft: ProfileDraft;
  onEdit: () => void;
  onHome: () => void;
  onSearchAsSponsor: () => void;
}) {
  const totalReach = draft.audienceSize + draft.instagramFollowers;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <div className="animate-rise rounded-3xl bg-gain-50 px-6 py-5 ring-1 ring-inset ring-gain-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gain-500 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gain-500" />
          </span>
          <p className="font-display text-xl font-bold tracking-tight text-gain-700">You're live</p>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-gain-600">
          You are in the pool now — sponsors searching {COUNTRY_LABEL[draft.country]} will see this
          profile in their matches. Listing is free, and you are never charged to be contacted.
        </p>
      </div>

      <h1 className="display mt-12 text-4xl leading-tight text-ink-950 sm:text-5xl">
        How sponsors see you
      </h1>

      {/* Deliberately the same card language as the sponsor side. */}
      <div className="mt-5 rounded-3xl bg-white p-6 ring-1 ring-inset ring-paper-line sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="display text-2xl leading-tight text-ink-950">{draft.name}</h2>
              <Badge tone="muted">Self-reported</Badge>
            </div>
            <p className="mt-1.5 text-sm text-ink-500">
              {draft.sport} · {draft.region}, {COUNTRY_LABEL[draft.country]}
            </p>
          </div>
          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-paper-dim text-ink-300 ring-1 ring-inset ring-paper-line">
            <span className="display text-xl leading-none">—</span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em]">fit</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <span className="display text-4xl leading-none tabular-nums text-ink-950">
              {totalReach.toLocaleString('en-US')}
            </span>
            <span className="ml-2 text-sm text-ink-500">people reached</span>
          </div>
          <div className="text-sm text-ink-400">
            Typical deal {formatEur(draft.dealRange[0])} – {formatEur(draft.dealRange[1])}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge>{draft.type}</Badge>
          <Badge>{draft.sport}</Badge>
        </div>

        <div className="mt-6 border-t border-paper-line pt-4">
          <p className="eyebrow text-ink-400">
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

      <p className="mt-3 text-[13px] text-ink-400">
        Your fit score is calculated per sponsor, so it only appears once someone searches. Add
        verified attendance later to raise how you rank.
      </p>

      {/* The demand side is real — show it. */}
      <section className="mt-14">
        <h2 className="eyebrow text-ink-400">
          Who's looking right now
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-inset ring-paper-line">
            <p className="display text-4xl tabular-nums text-flare-500">{demandSignal.activeSponsors}</p>
            <p className="mt-1 text-[13px] text-ink-500">active sponsors in your market</p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-inset ring-paper-line">
            <p className="display text-4xl tabular-nums text-flare-500">{demandSignal.searchingThisWeek}</p>
            <p className="mt-1 text-[13px] text-ink-500">searched this week</p>
          </div>
        </div>

        <ul className="mt-3 space-y-2">
          {demandSignal.recent.map((r) => (
            <li
              key={r.name}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-white px-5 py-3.5 text-sm ring-1 ring-inset ring-paper-line"
            >
              <span className="font-display font-medium text-ink-950">{r.name}</span>
              <span className="text-ink-500">looking for {r.detail}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-400">
          Illustrative demand data for the demo.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-3 border-t border-paper-line pt-8">
        <Button onClick={onSearchAsSponsor}>Search as a sponsor to find yourself →</Button>
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
