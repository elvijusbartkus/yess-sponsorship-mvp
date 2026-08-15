import type { Profile } from './types';

/** Flat, not tiered, and never discounted — the same 2% on every deal, always. */
export const COMMISSION_RATE = 0.02;

export interface Commission {
  rate: number;
  /** '2%' */
  rateLabel: string;
  amount: number;
}

export function computeCommission(dealValue: number): Commission {
  return {
    rate: COMMISSION_RATE,
    rateLabel: `${COMMISSION_RATE * 100}%`,
    amount: dealValue * COMMISSION_RATE,
  };
}

/**
 * A concrete example deal value for the demo: the point in the club's own
 * typical range closest to what the sponsor said they had. Keeps the number on
 * this screen coherent with the deal range shown on the match card, rather than
 * appearing from nowhere.
 */
export function exampleDealValue(profile: Profile, sponsorBudget: number): number {
  const [min, max] = profile.dealRange;
  const clamped = Math.min(Math.max(sponsorBudget, min), max);
  // Round to a clean figure a person would actually shake hands on.
  const step = clamped >= 10000 ? 1000 : clamped >= 2000 ? 500 : 250;
  return Math.round(clamped / step) * step;
}
