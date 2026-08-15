import { COMMISSION_RATE } from '../lib/commission';

/**
 * One source of truth for the money. The signup screen, the deal room, the
 * contract, and the pricing page all read from here, so the demo can't quote
 * three different numbers for the same thing.
 */
export const membershipPlan = {
  name: 'Sponsor membership',
  priceMonthly: 33.33,
  priceAnnual: 249,
  currency: '€',
  // Membership only gates the act of reaching out and closing — matching
  // itself is free, shown as a popup only when a sponsor presses Contact or
  // Propose a deal, never before.
  includes: [
    'Contact any club or athlete you match with',
    'Deal support through to signature',
    'Season reach reporting on live sponsorships',
  ],
  freeTier: [
    'Browse the full public list of clubs and athletes',
    'Run the matching quiz and see your ranked, scored matches',
    'Unlimited re-ranking as your answers change',
  ],
} as const;

/**
 * Clubs and athletes now pay too — a deliberate reversal of the original
 * "always free" model. The price is well below a single typical sponsorship
 * and includes the tools (deal support, deliverables tracking) that make the
 * platform worth staying on.
 */
export const clubPlan = {
  name: 'Club & athlete membership',
  priceMonthly: 9.99,
  priceAnnual: 49,
  currency: '€',
  includes: [
    'List your profile and be matched with sponsors',
    'Be contacted directly by interested businesses',
    'Deal support through to signature',
    'Deliverables tracker and campaign drafting tools',
  ],
} as const;

export const commission = {
  /** Flat, no size tiers, never discounted. */
  standard: COMMISSION_RATE,
} as const;

/**
 * Every new account's first subscription period is free — a permanent
 * acquisition policy, not a time-limited launch promo. Applies the same way
 * to the 1,000th sponsor as the 1st.
 */
export const firstPeriodFree = {
  clubMonths: 1,
  sponsorMonths: 2,
} as const;
