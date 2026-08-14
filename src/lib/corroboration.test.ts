import { describe, expect, it } from 'vitest';
import { consistencyFlag, matchSponsorToProfiles } from './matching';
import { profileFromDraft } from './draftToProfile';
import { profiles } from '../data/profiles';
import { personas } from '../data/personas';
import { clubSeeds } from '../data/clubFlow';
import type { Profile } from './types';

const byId = (id: string) => profiles.find((p) => p.id === id)!;

describe('the corroboration trust model', () => {
  it('never claims corroboration without a corroboration record', () => {
    for (const p of profiles) {
      if (p.audienceCorroborated) expect(p.corroboration).not.toBeNull();
    }
  });

  it('does not depend on gate attendance — corroboration comes from public signals', () => {
    for (const p of profiles) {
      if (!p.corroboration) continue;
      // Every source must be something readable in public, never a check-in.
      for (const source of p.corroboration.sources) {
        expect(source.toLowerCase()).not.toMatch(/check-?in|gate|turnstile|scan/);
      }
    }
  });

  it('flags a claim that public signals do not support', () => {
    const honest = byId('jk-tammeka');
    expect(consistencyFlag(honest)).toBeUndefined();

    const inflated: Profile = {
      ...honest,
      corroboration: { ...honest.corroboration!, claimedAudience: 9000, supportedAudience: 1480 },
    };
    expect(consistencyFlag(inflated)).toContain('9,000');
    expect(consistencyFlag(inflated)).toContain('1,480');
  });

  it('a self-listed profile starts uncorroborated with no record', () => {
    const p = profileFromDraft(clubSeeds[0].draft, 0);
    expect(p.audienceCorroborated).toBe(false);
    expect(p.corroboration).toBeNull();
    expect(consistencyFlag(p)).toBeUndefined();
  });

  it('ranks corroborated profiles first when the sponsor asks for it', () => {
    const answers = { ...personas[1].answers, priority: 'corroborated-audience' as const };
    const top = matchSponsorToProfiles(answers, profiles)[0];
    expect(top.corroboratedBadge).toBe(true);
  });
});
