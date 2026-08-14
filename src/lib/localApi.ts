import { profiles as seedProfiles } from '../data/profiles';
import { matchSponsorToProfiles } from './matching';
import { profileFromDraft } from './draftToProfile';
import { templateCampaign, type Campaign } from './campaignTemplate';
import { applyEnrichment, corroborateFromPublicSources, type EnrichmentResult } from './enrichment';
import type { Match, Profile, ProfileDraft, SponsorAnswers } from './types';

/**
 * The app running with no server at all.
 *
 * Everything the marketplace does — scoring, tax, commission, corroboration —
 * is pure computation over data we already ship, so it runs perfectly well in
 * the browser. The only things a backend genuinely buys are the live LLM calls,
 * because an API key must never reach the client; without one, those fall back
 * to the same templates the server would have used anyway.
 *
 * Profiles live in module state for the session. That is not a downgrade from
 * the hosted setup: free-tier hosting has no persistent disk either, so the
 * database re-seeds on every restart there too.
 */
let pool: Profile[] = [...seedProfiles];

export function localFetchProfiles(): Promise<{ profiles: Profile[] }> {
  return Promise.resolve({ profiles: [...pool] });
}

export function localFetchMatches(
  answers: SponsorAnswers,
): Promise<{ matches: Match[]; reasonSource: 'template' }> {
  return Promise.resolve({
    matches: matchSponsorToProfiles(answers, pool),
    reasonSource: 'template',
  });
}

export function localCreateProfile(draft: ProfileDraft): Promise<{ profile: Profile }> {
  const profile = profileFromDraft(draft, pool.length);
  pool = [...pool, profile];
  return Promise.resolve({ profile });
}

export function localDraftCampaign(
  sponsor: string,
  profileId: string,
): Promise<{ campaign: Campaign }> {
  const profile = pool.find((p) => p.id === profileId);
  if (!profile) return Promise.reject(new Error('Profile not found'));
  return Promise.resolve({ campaign: templateCampaign(sponsor, profile) });
}

/** Real network call — Wikipedia allows cross-origin reads, so no proxy needed. */
export async function localEnrichProfile(
  id: string,
): Promise<{ result: EnrichmentResult; profile: Profile }> {
  const profile = pool.find((p) => p.id === id);
  if (!profile) throw new Error('Profile not found');

  const result = await corroborateFromPublicSources(profile);
  const updated = applyEnrichment(profile, result);
  if (updated !== profile) pool = pool.map((p) => (p.id === id ? updated : p));

  return { result, profile: updated };
}
