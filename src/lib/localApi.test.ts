import { describe, expect, it } from 'vitest';
import {
  localCreateProfile,
  localDraftCampaign,
  localFetchMatches,
  localFetchProfiles,
} from './localApi';
import { personas } from '../data/personas';
import { clubSeeds } from '../data/clubFlow';

/**
 * The app has to work as a static site with no backend at all. These run the
 * whole marketplace through the local path, with fetch never touched.
 */
describe('the app works with no server', () => {
  it('serves the seeded profiles', async () => {
    const { profiles } = await localFetchProfiles();
    expect(profiles.length).toBeGreaterThan(0);
  });

  it('matches, scores and explains without a network call', async () => {
    const { matches, reasonSource } = await localFetchMatches(personas[0].answers);
    expect(matches.length).toBeGreaterThan(0);
    expect(reasonSource).toBe('template');
    for (const m of matches) {
      expect(m.score).toBeGreaterThan(0);
      expect(m.reasons.length).toBeGreaterThan(0);
      expect(m.taxBenefit.line.length).toBeGreaterThan(0);
    }
  });

  it('a self-listed club becomes discoverable in the same session', async () => {
    const before = (await localFetchProfiles()).profiles.length;
    const { profile } = await localCreateProfile(clubSeeds[0].draft);
    const after = (await localFetchProfiles()).profiles;

    expect(after.length).toBe(before + 1);
    expect(after.some((p) => p.id === profile.id)).toBe(true);
  });

  it('drafts campaign copy naming both sides', async () => {
    const { profiles } = await localFetchProfiles();
    const target = profiles[0];
    const { campaign } = await localDraftCampaign('Tartu Fitness', target.id);

    expect(campaign.post).toContain('Tartu Fitness');
    expect(campaign.post).toContain(target.name);
    expect(campaign.story).toContain(target.name);
    // No key in the browser, so this is never model-written client-side.
    expect(campaign.fromModel).toBe(false);
  });
});
