import { useMemo } from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import { COUNTRY_LABEL, matchProfileToSponsorLeads } from '../../lib/matching';
import { profileFromDraft } from '../../lib/draftToProfile';
import { sponsorLeads } from '../../data/sponsorLeads';
import { clubPlan, firstPeriodFree } from '../../data/pricing';
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
  // For an athlete the following IS the audience — adding both would double it.
  const totalReach =
    draft.type === 'athlete' ? draft.audienceSize : draft.audienceSize + draft.instagramFollowers;

  // Reverse-matched against the same scoring engine a sponsor's own search
  // uses — this is "who could you reach out to", not a live inbox.
  const leadMatches = useMemo(
    () => matchProfileToSponsorLeads(profileFromDraft(draft, 0), sponsorLeads),
    [draft],
  );

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-14">
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

      <p className="mt-5 text-lg text-ink-500">
        {clubPlan.currency}
        {clubPlan.priceMonthly}/month
        {' '}(first {firstPeriodFree.clubMonths} month free). You keep
        the full deal.
      </p>
      <p className="mt-1.5 text-sm text-ink-400">
        Not exclusive: keep any other sponsors or agents you already work with.
      </p>

      {/* Exactly what a sponsor sees — same card language as their side. */}
      <div className="mt-8 rounded-xl bg-white p-6 ring-1 ring-inset ring-paper-line sm:p-5">
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

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="ghost" onClick={onHome}>
          Home
        </Button>
      </div>

      <section className="mt-10">
        <h2 className="eyebrow text-ink-400">Businesses you could reach out to</h2>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-500">
          Illustrative sponsor types, scored against your profile with the same
          matching engine sponsors use, not live leads, a starting list.
        </p>

        {leadMatches.length === 0 ? (
          <p className="mt-5 text-sm text-ink-400">
            No strong sponsor type for this profile yet. Try widening what you offer.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {leadMatches.map(({ lead, score, reasons }) => (
              <div
                key={lead.id}
                className="rounded-lg bg-white p-5 ring-1 ring-inset ring-paper-line"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-medium text-ink-950">{lead.label}</p>
                    <p className="mt-0.5 text-sm text-ink-500">{lead.blurb}</p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-md bg-ink-950 ring-hairline-dark">
                    <span className="display text-base leading-none text-flare-500">{score}</span>
                  </div>
                </div>
                {reasons[0] && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{reasons[0]}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
