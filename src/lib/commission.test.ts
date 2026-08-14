import { describe, expect, it } from 'vitest';
import { COMMISSION_THRESHOLD, computeCommission, exampleDealValue } from './commission';
import { profiles } from '../data/profiles';

const byId = (id: string) => profiles.find((p) => p.id === id)!;

describe('commission tiers', () => {
  it('charges 10% on a small deal', () => {
    const c = computeCommission(8000);
    expect(c.rateLabel).toBe('10%');
    expect(c.amount).toBe(800);
  });

  it('charges 2% on a large deal', () => {
    const c = computeCommission(30000);
    expect(c.rateLabel).toBe('2%');
    expect(c.amount).toBe(600);
  });

  it('treats the threshold itself as a small deal', () => {
    expect(computeCommission(COMMISSION_THRESHOLD).rateLabel).toBe('10%');
    expect(computeCommission(COMMISSION_THRESHOLD + 1).rateLabel).toBe('2%');
  });
});

describe('example deal value', () => {
  it('stays inside the club\'s own published deal range', () => {
    for (const profile of profiles) {
      for (const budget of [1250, 6000, 30000, 75000]) {
        const value = exampleDealValue(profile, budget);
        expect(value).toBeGreaterThanOrEqual(profile.dealRange[0]);
        expect(value).toBeLessThanOrEqual(profile.dealRange[1]);
      }
    }
  });

  it('lands on a clean, human figure', () => {
    expect(exampleDealValue(byId('jk-tammeka'), 6000)).toBe(6000);
    expect(exampleDealValue(byId('parnu-sport'), 1250)).toBe(1250);
  });
});
