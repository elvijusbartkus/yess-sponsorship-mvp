import { describe, expect, it } from 'vitest';
import {
  matchSponsorToProfiles,
  scoreDemographic,
  scoreGeography,
  scoreWants,
} from './matching';
import { computeTaxBenefit } from './taxRules';
import { profiles } from '../data/profiles';
import { personas } from '../data/personas';
import { budgetBands } from '../data/sponsorQuiz';
import type { SponsorAnswers } from './types';

const tartuGym = personas[0].answers;
const eeBank = personas[1].answers;
const ltBrand = personas[2].answers;

const byId = (id: string) => profiles.find((p) => p.id === id)!;

describe('geography scoring', () => {
  it('never scores across borders', () => {
    expect(scoreGeography(tartuGym, byId('bc-vilnius-rytas-akademija'))).toBe(0);
  });

  it('gives full credit for an exact city match', () => {
    expect(scoreGeography(tartuGym, byId('jk-tammeka'))).toBe(30);
  });

  it('scopes "national" to the sponsor\'s own country', () => {
    const eeNational: SponsorAnswers = { ...tartuGym, region: 'National' };
    expect(scoreGeography(eeNational, byId('kertu-lepik'))).toBe(30);
    expect(scoreGeography(eeNational, byId('bc-vilnius-rytas-akademija'))).toBe(0);
  });
});

describe('demographic scoring — weak matches must rank low', () => {
  it('scores a youth club at zero in a 35-54 search', () => {
    const seeking3554: SponsorAnswers = { ...tartuGym, demographic: '35-54' };
    expect(scoreDemographic(seeking3554, byId('tallinn-basket-youth'))).toBe(0);
  });

  it('gives only partial credit for genuinely adjacent audiences', () => {
    // families is adjacent to youth, not a direct hit
    expect(scoreDemographic(tartuGym, byId('parnu-sport'))).toBe(16);
  });

  it('ranks a non-overlapping profile below an exact one', () => {
    const matches = matchSponsorToProfiles(tartuGym, profiles);
    const youthClub = matches.find((m) => m.profile.id === 'tallinn-basket-youth');
    const handball = matches.find((m) => m.profile.id === 'narva-handball');
    expect(youthClub).toBeDefined();
    if (handball) expect(youthClub!.score).toBeGreaterThan(handball.score);
  });
});

describe('score bounds', () => {
  it('stays within 0-100 for every persona', () => {
    for (const persona of personas) {
      for (const match of matchSponsorToProfiles(persona.answers, profiles)) {
        expect(match.score).toBeGreaterThan(0);
        expect(match.score).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('what the sponsor wants in return', () => {
  it('scores zero when the club cannot deliver it', () => {
    // HK Riga offers visibility and naming, but no hospitality.
    expect(scoreWants({ ...tartuGym, wants: 'hospitality' }, byId('hk-riga-stars'))).toBe(0);
    expect(scoreWants({ ...tartuGym, wants: 'naming' }, byId('hk-riga-stars'))).toBe(12);
  });

  it('stays neutral when the sponsor has no preference', () => {
    for (const profile of profiles) {
      expect(scoreWants({ ...tartuGym, wants: 'any' }, profile)).toBe(7);
    }
  });

  it('changes the ranking, so the question earns its place', () => {
    const base = { ...eeBank, region: 'Tallinn' as const, demographic: 'all' as const };
    const order = (w: 'visibility' | 'naming' | 'hospitality') =>
      matchSponsorToProfiles({ ...base, wants: w }, profiles).map((m) => m.profile.id).join();
    expect(order('naming')).not.toBe(order('hospitality'));
  });

  it('says so honestly when the club cannot deliver it', () => {
    const matches = matchSponsorToProfiles({ ...tartuGym, wants: 'hospitality' }, profiles);
    const cannot = matches.filter((m) => !m.profile.activationTypes.includes('hospitality'));
    for (const m of cannot) expect(m.caution).toBeDefined();
  });
});

describe('the optional priority question visibly re-ranks', () => {
  const base: SponsorAnswers = {
    ...eeBank,
    demographic: 'youth',
    region: 'Tallinn',
    wants: 'visibility',
    budgetBand: budgetBands[2],
    budget: budgetBands[2].midpoint,
  };

  it('puts a verified profile top when the sponsor asks for verified audience', () => {
    const verified = matchSponsorToProfiles({ ...base, priority: 'corroborated-audience' }, profiles);
    expect(verified[0].profile.audienceCorroborated).toBe(true);
  });

  it('produces a different ranking for each priority, not just different scores', () => {
    const order = (p: SponsorAnswers['priority']) =>
      matchSponsorToProfiles({ ...base, priority: p }, profiles)
        .map((m) => m.profile.id)
        .join();

    // If these came out identical the question would be theatre.
    expect(order('corroborated-audience')).not.toBe(order('value-for-money'));
    expect(order('corroborated-audience')).not.toBe(order('local-story'));
  });

  it('promotes a small local club when the sponsor wants a local story', () => {
    const local = matchSponsorToProfiles({ ...base, priority: 'local-story' }, profiles);
    expect(local[0].profile.isNational).toBe(false);
  });
});

describe('reasons are specific, not boilerplate', () => {
  it('gives every match on a run a distinct top reason', () => {
    for (const persona of personas) {
      const matches = matchSponsorToProfiles(persona.answers, profiles);
      const topReasons = matches.map((m) => m.reasons[0]);
      expect(new Set(topReasons).size).toBe(topReasons.length);
    }
  });

  it('never claims a profile reaches an audience in a city it is not in', () => {
    for (const match of matchSponsorToProfiles(tartuGym, profiles)) {
      if (match.profile.region !== 'Tartu' && !match.profile.isNational) {
        expect(match.reasons.join(' ')).not.toContain('in Tartu');
      }
    }
  });

  it('flags weak matches honestly instead of dressing them up', () => {
    const matches = matchSponsorToProfiles(tartuGym, profiles);
    const weak = matches.filter((m) => m.score < 55);
    for (const m of weak) expect(m.caution).toBeDefined();
  });
});

describe('market boundary', () => {
  it('only ever returns profiles from the sponsor\'s own country', () => {
    for (const persona of personas) {
      const matches = matchSponsorToProfiles(persona.answers, profiles);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.every((m) => m.profile.country === persona.answers.country)).toBe(true);
    }
  });
});

describe('tax is honest and secondary', () => {
  it('computes the Lithuanian enhanced deduction at 16% CIT', () => {
    const benefit = computeTaxBenefit(1000, byId('bc-vilnius-rytas-akademija'));
    expect(benefit.applies).toBe(true);
    expect(benefit.deduction).toBe(2000);
    expect(benefit.taxSaved).toBe(320);
    expect(benefit.realCost).toBe(680);
  });

  it('computes the Estonian allowance against the 22% distribution tax', () => {
    const benefit = computeTaxBenefit(1000, byId('jk-tammeka'));
    expect(benefit.applies).toBe(true);
    expect(benefit.taxSaved).toBe(220);
  });

  it('never invents a saving where no status exists', () => {
    for (const id of ['hk-riga-stars', 'narva-handball', 'mantas-jurgaitis']) {
      const benefit = computeTaxBenefit(1000, byId(id));
      expect(benefit.applies).toBe(false);
      expect(benefit.taxSaved).toBe(0);
      expect(benefit.realCost).toBe(1000);
      expect(benefit.tag).not.toMatch(/€/);
    }
  });

  it('does not let tax status decide the ranking', () => {
    // Two profiles differing only in tax status must score identically.
    const withStatus = byId('jk-tammeka');
    const withoutStatus = { ...withStatus, id: 'x', taxStatus: { hasSponsorshipStatus: false, benefit: { kind: 'none' as const }, note: '' } };
    const answers: SponsorAnswers = { ...tartuGym, demographic: '18-34' };
    const [a, b] = matchSponsorToProfiles(answers, [withStatus, withoutStatus]);
    expect(a.score).toBe(b.score);
  });
});

describe('the Lithuanian run still works', () => {
  it('puts the qualifying Vilnius club top for the LT brand', () => {
    const matches = matchSponsorToProfiles(ltBrand, profiles);
    expect(matches[0].profile.id).toBe('bc-vilnius-rytas-akademija');
    expect(matches[0].taxBenefit.applies).toBe(true);
  });
});
