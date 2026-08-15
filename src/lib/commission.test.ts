import { describe, expect, it } from 'vitest';
import { computeCommission, exampleDealValue } from './commission';
import { profiles } from '../data/profiles';

const byId = (id: string) => profiles.find((p) => p.id === id)!;

describe('commission is flat, not tiered, and never discounted', () => {
  it('charges 2% regardless of deal size', () => {
    expect(computeCommission(8000).rateLabel).toBe('2%');
    expect(computeCommission(8000).amount).toBe(160);
    expect(computeCommission(300000).rateLabel).toBe('2%');
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
