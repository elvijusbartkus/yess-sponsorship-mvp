import { describe, expect, it } from 'vitest';
import { profileFromDraft } from './draftToProfile';
import { matchSponsorToProfiles } from './matching';
import { computeTaxBenefit } from './taxRules';
import { clubSeeds } from '../data/clubFlow';
import { personas } from '../data/personas';

const draft = clubSeeds[0].draft; // Tartu football club, €2k–10k

describe('self-listed profiles', () => {
  it('never claims verification or tax status the club has not proven', () => {
    const profile = profileFromDraft(draft, 0);
    expect(profile.audienceVerified).toBe(false);
    expect(profile.taxStatus.hasSponsorshipStatus).toBe(false);
    expect(computeTaxBenefit(5000, profile).applies).toBe(false);
    expect(computeTaxBenefit(5000, profile).taxSaved).toBe(0);
  });

  it('does not invent a demographic the builder never asked about', () => {
    expect(profileFromDraft(draft, 0).demographics).toEqual(['all']);
  });

  it('becomes discoverable to a sponsor searching that market', () => {
    const profile = profileFromDraft(draft, 0);
    // A Tartu sponsor with a matching budget should now see them.
    const tartuSponsor = personas[0].answers;
    const matches = matchSponsorToProfiles(
      { ...tartuSponsor, budgetBand: { ...tartuSponsor.budgetBand, min: 2000, max: 10000 } },
      [profile],
    );
    expect(matches).toHaveLength(1);
    expect(matches[0].profile.name).toBe(draft.name);
  });

  it('gives each submission a distinct id', () => {
    const a = profileFromDraft(draft, 0);
    const b = profileFromDraft(draft, 1);
    expect(a.id).not.toBe(b.id);
  });
});
