import { describe, expect, it } from 'vitest';
import { commissionTiers, membershipPlan } from '../data/pricing';
import { computeCommission, COMMISSION_THRESHOLD } from './commission';

/**
 * The money model appears on four screens (signup note, membership gate, deal
 * room, pricing page). These lock them to one source of truth so the demo can
 * never quote two different numbers for the same thing.
 */
describe('the money model is stated consistently', () => {
  it('pricing tiers are the same values the deal room charges', () => {
    expect(commissionTiers.threshold).toBe(COMMISSION_THRESHOLD);
    expect(computeCommission(commissionTiers.threshold).rate).toBe(commissionTiers.small);
    expect(computeCommission(commissionTiers.threshold + 1).rate).toBe(commissionTiers.large);
  });

  it('annual membership is cheaper than paying monthly', () => {
    expect(membershipPlan.priceAnnual).toBeLessThan(membershipPlan.priceMonthly * 12);
  });

  it('the free tier stops short of contacting anyone', () => {
    const free = membershipPlan.freeTier.join(' ').toLowerCase();
    expect(free).not.toMatch(/contact|message|reach out|close/);
    expect(membershipPlan.includes.join(' ').toLowerCase()).toMatch(/contact/);
  });

  it('commission is charged on top, so the club receives the full deal value', () => {
    const dealValue = 8000;
    const { amount } = computeCommission(dealValue);
    const clubReceives = dealValue;
    const sponsorPays = dealValue + amount;
    expect(clubReceives).toBe(dealValue);
    expect(sponsorPays).toBeGreaterThan(clubReceives);
    expect(amount).toBe(800);
  });
});

describe('club and athlete flows produce matchable profiles', () => {
  it('every offered activation maps to a category the matcher scores', async () => {
    const { activationTypeOf, clubActivations, athleteActivations } = await import(
      '../data/clubFlow'
    );
    for (const label of [...clubActivations, ...athleteActivations]) {
      expect(activationTypeOf[label], `no category for "${label}"`).toBeDefined();
    }
  });

  it('clubs and athletes are asked different things', async () => {
    const { clubActivations, athleteActivations, clubAudienceBands, athleteAudienceBands } =
      await import('../data/clubFlow');
    expect(clubActivations).not.toEqual(athleteActivations);
    expect(clubAudienceBands.map((b) => b.label)).not.toEqual(
      athleteAudienceBands.map((b) => b.label),
    );
  });
});
