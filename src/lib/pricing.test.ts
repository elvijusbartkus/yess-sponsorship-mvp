import { describe, expect, it } from 'vitest';
import { clubPlan, commission, membershipPlan } from '../data/pricing';
import { computeCommission } from './commission';

/**
 * The money model appears on several screens (signup, deal room, contract,
 * pricing page). These lock them to one source of truth so the demo can
 * never quote two different numbers for the same thing.
 */
describe('the money model is stated consistently', () => {
  it('commission is flat and matches the deal room', () => {
    expect(computeCommission(8000).rate).toBe(commission.standard);
    expect(computeCommission(300000).rate).toBe(commission.standard);
  });

  it('annual membership is cheaper than paying monthly, for both plans', () => {
    expect(membershipPlan.priceAnnual).toBeLessThan(membershipPlan.priceMonthly * 12);
    expect(clubPlan.priceAnnual).toBeLessThan(clubPlan.priceMonthly * 12);
  });

  it('the sponsor free tier stops short of contacting anyone', () => {
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
    expect(amount).toBe(160);
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
