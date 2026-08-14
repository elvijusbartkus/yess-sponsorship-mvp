import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import { COUNTRY_LABEL } from '../../lib/matching';
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
  // For an athlete the following IS the audience — adding both would double it.
  const totalReach =
    draft.type === 'athlete' ? draft.audienceSize : draft.audienceSize + draft.instagramFollowers;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-14 sm:py-20">
      <div className="animate-rise flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gain-500 opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-gain-500" />
        </span>
        <p className="eyebrow text-gain-700">You're live</p>
      </div>

      <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-ink-950">
        Sponsors can
        <br />
        find you now.
      </h1>

      <p className="mt-5 text-lg text-ink-500">Free to list. You keep the full deal.</p>

      {/* Exactly what a sponsor sees — same card language as their side. */}
      <div className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-inset ring-paper-line sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="display text-2xl leading-tight text-ink-950">{draft.name}</h2>
          <Badge tone="muted">Self-reported</Badge>
        </div>
        <p className="mt-1.5 text-sm text-ink-500">
          {draft.sport} · {draft.region}, {COUNTRY_LABEL[draft.country]}
        </p>

        <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <span className="display text-4xl leading-none tabular-nums text-ink-950">
              {totalReach.toLocaleString('en-US')}
            </span>
            <span className="ml-2 text-sm text-ink-500">
              {draft.type === 'athlete' ? 'following' : 'reached'}
            </span>
          </div>
          <div className="text-sm text-ink-400">
            {formatEur(draft.dealRange[0])}–{formatEur(draft.dealRange[1])}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {draft.competitionLevel && <Badge>{draft.competitionLevel.replace(/-/g, ' ')}</Badge>}
          {draft.activation.map((a) => (
            <Badge key={a} tone="accent">
              {a}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" onClick={onSearchAsSponsor}>
          See yourself as a sponsor →
        </Button>
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="ghost" onClick={onHome}>
          Home
        </Button>
      </div>
    </div>
  );
}
