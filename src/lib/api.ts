import type { Match, Profile, ProfileDraft, SponsorAnswers } from './types';

const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    // A 404 on /api almost always means the frontend is deployed without the
    // API behind it — say that, rather than echoing a hosting provider's
    // request id at the user.
    if (res.status === 404 && BASE === '/api') {
      throw new Error(
        'No API is running at /api. In development run `npm run dev:all`; when deployed, set VITE_API_URL to the backend URL.',
      );
    }
    const body = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 140)}` : ''}`);
  }
  return (await res.json()) as T;
}

export function fetchProfiles(): Promise<{ profiles: Profile[] }> {
  return request('/profiles');
}

export function fetchMatches(
  answers: SponsorAnswers,
): Promise<{ matches: Match[]; reasonSource: 'model' | 'template' }> {
  return request('/match', { method: 'POST', body: JSON.stringify({ answers }) });
}

export function createProfile(draft: ProfileDraft): Promise<{ profile: Profile }> {
  return request('/profiles', { method: 'POST', body: JSON.stringify({ draft }) });
}

export interface Campaign {
  post: string;
  story: string;
  fromModel: boolean;
}

export function draftCampaign(
  sponsor: string,
  profileId: string,
): Promise<{ campaign: Campaign }> {
  return request('/campaign', {
    method: 'POST',
    body: JSON.stringify({ sponsor, profileId }),
  });
}

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

export function enrichProfile(
  id: string,
): Promise<{ result: EnrichmentResult; profile: Profile }> {
  return request(`/profiles/${encodeURIComponent(id)}/enrich`, { method: 'POST' });
}
