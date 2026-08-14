import { useState } from 'react';
import { draftCampaign, type Campaign } from '../../lib/api';
import type { Profile } from '../../lib/types';

/**
 * The curation layer. We don't just introduce the two sides — we write and run
 * the marketing between them, because clubs and athletes are training, not
 * selling themselves. It's the value-add, and it's why the deal stays here
 * instead of walking off the platform after the introduction.
 *
 * One button, two outputs. Deliberately small.
 */
export function CampaignCurator({
  sponsorName,
  profile,
}: {
  sponsorName: string;
  profile: Profile;
}) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);

  function generate() {
    setLoading(true);
    draftCampaign(sponsorName, profile.id)
      .then(({ campaign: drafted }) => setCampaign(drafted))
      .catch(() => setCampaign(null))
      .finally(() => setLoading(false));
  }

  return (
    <section className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-inset ring-paper-line sm:p-7">
      <p className="eyebrow text-flare-600">We curate the campaign</p>
      <h2 className="display mt-3 text-2xl leading-tight text-ink-950">
        {profile.name} trains. We do the marketing.
      </h2>

      {!campaign && (
        <button
          onClick={generate}
          disabled={loading}
          className="mt-5 rounded-full bg-ink-950 px-6 py-3 font-medium text-white transition-all hover:bg-flare-500 disabled:opacity-50"
        >
          {loading ? 'Drafting…' : 'Draft the campaign'}
        </button>
      )}

      {campaign && (
        <div className="mt-5 space-y-3 animate-rise">
          <div className="rounded-2xl bg-paper-dim p-5">
            <p className="eyebrow text-ink-400">Launch post</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-800">{campaign.post}</p>
          </div>
          <div className="rounded-2xl bg-paper-dim p-5">
            <p className="eyebrow text-ink-400">Story</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-800">{campaign.story}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-[13px] text-ink-400">
              {campaign.fromModel
                ? 'Drafted just now for this sponsorship.'
                : 'Drafted from a template — connect a model key for live copy.'}
            </p>
            <button
              onClick={generate}
              disabled={loading}
              className="text-[13px] font-medium text-flare-600 transition-colors hover:text-flare-500 disabled:opacity-50"
            >
              {loading ? 'Drafting…' : 'Draft again'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
