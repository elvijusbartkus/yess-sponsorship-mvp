import type { Corroboration, Profile } from './types';

/**
 * Corroborates a profile against a real, public, key-free source.
 *
 * Lives in shared code because the Wikipedia REST API sends
 * `access-control-allow-origin: *`, so the browser can call it directly — no
 * server required for this half of the trust model.
 *
 * Honest scope note: Instagram and Facebook follower counts are NOT readable
 * without platform credentials and app review, so nothing here pretends to
 * scrape them. Existence and coverage are corroborated for real; live follower
 * counts need Meta Graph API access granted by each club, which is a business
 * step rather than a technical one.
 */

const WIKI = 'https://en.wikipedia.org/w/rest.php/v1/search/page';

export interface EnrichmentResult {
  ok: boolean;
  checkedAt: string;
  query: string;
  found: boolean;
  title?: string;
  description?: string;
  url?: string;
  note: string;
}

export async function corroborateFromPublicSources(
  profile: Profile,
  signal?: AbortSignal,
): Promise<EnrichmentResult> {
  const checkedAt = new Date().toISOString();
  const query = profile.name;

  try {
    const res = await fetch(`${WIKI}?q=${encodeURIComponent(query)}&limit=3`, {
      headers: { Accept: 'application/json' },
      signal,
    });

    if (!res.ok) {
      return {
        ok: false,
        checkedAt,
        query,
        found: false,
        note: `Public source lookup returned ${res.status}.`,
      };
    }

    const body = (await res.json()) as {
      pages?: { key: string; title: string; description: string | null }[];
    };
    const hit = body.pages?.[0];

    if (!hit) {
      return {
        ok: true,
        checkedAt,
        query,
        found: false,
        note: 'No public entry found — figures remain self-reported.',
      };
    }

    return {
      ok: true,
      checkedAt,
      query,
      found: true,
      title: hit.title,
      description: hit.description ?? undefined,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(hit.key)}`,
      note: 'Existence corroborated against a public source. Follower counts still need platform API access granted by the club.',
    };
  } catch (error) {
    return {
      ok: false,
      checkedAt,
      query,
      found: false,
      note: `Lookup failed: ${(error as Error).message}`,
    };
  }
}

/** Folds a successful lookup into the profile's corroboration record. */
export function applyEnrichment(profile: Profile, result: EnrichmentResult): Profile {
  if (!result.ok || !result.found) return profile;

  const existing: Corroboration = profile.corroboration ?? {
    socialReach: profile.reach.instagramFollowers + profile.reach.facebookFans,
    pressMentions: profile.reach.pressMentions,
    existingSponsors: profile.currentSponsors.length,
    claimedAudience: profile.audienceSize,
    supportedAudience: profile.audienceSize,
    lastCheckedAt: null,
    sources: [],
  };

  const source = `Wikipedia: ${result.title} (checked ${result.checkedAt.slice(0, 10)})`;

  return {
    ...profile,
    corroboration: {
      ...existing,
      lastCheckedAt: result.checkedAt,
      sources: existing.sources.includes(source) ? existing.sources : [...existing.sources, source],
    },
  };
}
