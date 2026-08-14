import { useState } from 'react';
import { draftCampaign, type Campaign } from '../../lib/api';
import type { Profile } from '../../lib/types';

/**
 * Deliberately the smaller, quieter card here — the deliverables tracker
 * above is the actual reason a sponsor stays on the platform (a real record
 * to justify spend and renew against). This is just the setup hook that gets
 * the campaign copy into structured form in the first place, so it reads as
 * secondary: no ring, no dark button, smaller type.
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
    <section className="mt-6 rounded-lg bg-paper-dim p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
        Also: draft the launch campaign
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
        Turns this deal into a launch post and story caption. The deliverables above are what
        actually get tracked.
      </p>

      {!campaign && (
        <button
          onClick={generate}
          disabled={loading}
          className="mt-3 text-sm font-medium text-flare-600 transition-colors hover:text-flare-500 disabled:opacity-50"
        >
          {loading ? 'Drafting…' : 'Draft the campaign →'}
        </button>
      )}

      {campaign && (
        <div className="mt-3 space-y-2.5 animate-rise">
          <div className="rounded-md bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">Launch post</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-800">{campaign.post}</p>
          </div>
          <div className="rounded-md bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">Story</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-800">{campaign.story}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-[12px] text-ink-400">
              {campaign.fromModel
                ? 'Drafted just now for this sponsorship.'
                : 'Drafted from a template — connect a model key for live copy.'}
            </p>
            <button
              onClick={generate}
              disabled={loading}
              className="text-[12px] font-medium text-flare-600 transition-colors hover:text-flare-500 disabled:opacity-50"
            >
              {loading ? 'Drafting…' : 'Draft again'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
