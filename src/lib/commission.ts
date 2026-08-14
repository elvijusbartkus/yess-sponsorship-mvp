import type { Profile } from './types';

/** Deals at or below this take the small-deal rate. */
export const COMMISSION_THRESHOLD = 10000;
export const SMALL_DEAL_RATE = 0.1;
export const LARGE_DEAL_RATE = 0.02;

export interface Commission {
  rate: number;
  /** '10%' / '2%' */
  rateLabel: string;
  tierLabel: string;
  amount: number;
}

export function computeCommission(dealValue: number): Commission {
  const isLarge = dealValue > COMMISSION_THRESHOLD;
  const rate = isLarge ? LARGE_DEAL_RATE : SMALL_DEAL_RATE;
  return {
    rate,
    rateLabel: `${rate * 100}%`,
    tierLabel: isLarge
      ? `deals over €${COMMISSION_THRESHOLD.toLocaleString('en-US')}`
      : `deals up to €${COMMISSION_THRESHOLD.toLocaleString('en-US')}`,
    amount: dealValue * rate,
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
