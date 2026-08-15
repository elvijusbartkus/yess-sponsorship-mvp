import {
  localCreateProfile,
  localDraftCampaign,
  localEnrichProfile,
  localFetchMatches,
  localFetchProfiles,
} from './localApi';
import type { Campaign } from './campaignTemplate';
import type { EnrichmentResult } from './enrichment';
import type { Match, Profile, ProfileDraft, SponsorAnswers } from './types';

export type { Campaign, EnrichmentResult };

/**
 * The app runs standalone by default — no server, nothing to deploy but static
 * files. Set VITE_API_URL to point it at the backend instead; the only thing
 * that buys you is live LLM copy, since an API key must stay server-side.
 * Everything else is computed identically either way.
 */
const BASE = import.meta.env.VITE_API_URL;
export const usingRemoteApi = Boolean(BASE);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}${body ? `: ${body.slice(0, 140)}` : ''}`);
  }
  return (await res.json()) as T;
}

export function fetchProfiles(): Promise<{ profiles: Profile[] }> {
  return usingRemoteApi ? request('/profiles') : localFetchProfiles();
}

export function fetchMatches(
  answers: SponsorAnswers,
): Promise<{ matches: Match[]; reasonSource: 'model' | 'template' }> {
  return usingRemoteApi
    ? request('/match', { method: 'POST', body: JSON.stringify({ answers }) })
    : localFetchMatches(answers);
}

export function createProfile(draft: ProfileDraft): Promise<{ profile: Profile }> {
  return usingRemoteApi
    ? request('/profiles', { method: 'POST', body: JSON.stringify({ draft }) })
    : localCreateProfile(draft);
}

export function draftCampaign(sponsor: string, profileId: string): Promise<{ campaign: Campaign }> {
  return usingRemoteApi
    ? request('/campaign', { method: 'POST', body: JSON.stringify({ sponsor, profileId }) })
    : localDraftCampaign(sponsor, profileId);
}

export function enrichProfile(id: string): Promise<{ result: EnrichmentResult; profile: Profile }> {
  return usingRemoteApi
    ? request(`/profiles/${encodeURIComponent(id)}/enrich`, { method: 'POST' })
    : localEnrichProfile(id);
}
