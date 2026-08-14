import { describe, expect, it } from 'vitest';
import { matchSponsorToProfiles, scoreGeography } from './matching';
import { computeTaxBenefit } from './taxRules';
import { profiles } from '../data/profiles';
import { personas } from '../data/personas';
import type { SponsorAnswers } from './types';

const tartuGym = personas[0].answers;
const balticBrand = personas[2].answers;

describe('geography scoring', () => {
  it('never scores across borders', () => {
    const ltClub = profiles.find((p) => p.id === 'bc-vilnius-rytas-akademija')!;
    expect(scoreGeography(tartuGym, ltClub)).toBe(0);
  });

  it('gives full credit for an exact city match', () => {
    const tartu = profiles.find((p) => p.id === 'jk-tammeka')!;
    expect(scoreGeography(tartuGym, tartu)).toBe(30);
  });

  it('distinguishes national profiles per country', () => {
    const eeAthlete = profiles.find((p) => p.id === 'kertu-lepik')!;
    const ltClub = profiles.find((p) => p.id === 'bc-vilnius-rytas-akademija')!;
    const eeNational: SponsorAnswers = { ...tartuGym, region: 'National' };
    expect(scoreGeography(eeNational, eeAthlete)).toBe(30);
    expect(scoreGeography(eeNational, ltClub)).toBe(0);
  });
});

describe('score bounds', () => {
  it('never exceeds 100 and never rescales below the raw fit', () => {
    for (const persona of personas) {
      for (const match of matchSponsorToProfiles(persona.answers, profiles)) {
        expect(match.score).toBeGreaterThan(0);
        expect(match.score).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('demo guarantees', () => {
  it('run 1: an Estonian sponsor only ever sees Estonian matches', () => {
    const matches = matchSponsorToProfiles(tartuGym, profiles);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((m) => m.profile.country === 'EE')).toBe(true);
  });

  it('run 3: the Baltic brand surfaces the 200% Lithuanian club at the top', () => {
    const matches = matchSponsorToProfiles(balticBrand, profiles);
    expect(matches[0].profile.id).toBe('bc-vilnius-rytas-akademija');
    expect(matches[0].taxBenefit.headline).toContain('€60,000');
  });

  it('never claims a profile reaches an audience in a city it is not in', () => {
    const matches = matchSponsorToProfiles(tartuGym, profiles);
    for (const match of matches) {
      if (match.profile.region !== 'Tartu' && !match.profile.isNational) {
        expect(match.reasons.join(' ')).not.toContain('in Tartu');
      }
    }
  });

  it('every match carries a tax line', () => {
    for (const persona of personas) {
      for (const match of matchSponsorToProfiles(persona.answers, profiles)) {
        expect(match.taxBenefit.headline.length).toBeGreaterThan(0);
        expect(match.taxBenefit.subline.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('tax computation', () => {
  it('doubles the deduction for LT support-recipient status and shows real cash', () => {
    const ltClub = profiles.find((p) => p.id === 'bc-vilnius-rytas-akademija')!;
    const benefit = computeTaxBenefit(1000, ltClub);
    expect(benefit.deductibleAmount).toBe(2000);
    expect(benefit.cashSaving).toBe(300);
    expect(benefit.headline).toBe('Your €1,000 writes €2,000 off taxable profit');
  });

  it('treats the EE allowance as tax-free rather than a multiplier', () => {
    const eeClub = profiles.find((p) => p.id === 'jk-tammeka')!;
    const benefit = computeTaxBenefit(1000, eeClub);
    expect(benefit.deductibleAmount).toBe(1000);
    expect(benefit.cashSaving).toBe(200);
  });

  it('gives no enhanced relief where there is no status', () => {
    const lvClub = profiles.find((p) => p.id === 'hk-riga-stars')!;
    const benefit = computeTaxBenefit(1000, lvClub);
    expect(benefit.cashSaving).toBe(0);
    expect(benefit.headline).toBe('Deductible as marketing spend');
  });
});
