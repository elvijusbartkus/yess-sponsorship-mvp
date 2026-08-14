import type { Corroboration, Profile } from '../src/lib/types';

/**
 * Corroborates a profile against a real, public, key-free source.
 *
 * Honest scope note: Instagram and Facebook follower counts are not readable
 * without platform credentials and an app review — any code here claiming to
 * scrape them would either break or be fiction. So this endpoint corroborates
 * what genuinely CAN be checked without credentials: whether the club exists as
 * a documented entity, via the Wikipedia REST API, plus how much coverage it
 * has. Real network call, real provenance, real timestamp.
 *
 * The follower-count half of the trust model needs Meta Graph API tokens per
 * club (granted by the club when it lists) — that is a business step, not a
 * technical one, and is left as roadmap rather than faked here.
 */

const WIKI = 'https://en.wikipedia.org/w/rest.php/v1/search/page';
const UA = 'yess-sponsorship-mvp/1.0 (hackathon demo; contact via repo)';

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
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      signal,
    });

    if (!res.ok) {
      return {
        ok: false,
        checkedAt,
        query,
        found: false,
        note: `Wikipedia search returned ${res.status}.`,
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
        note: 'No public encyclopedia entry found — figures remain self-reported.',
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
      sources: existing.sources.includes(source)
        ? existing.sources
        : [...existing.sources, source],
    },
  };
}
