import { COMMISSION_THRESHOLD, LARGE_DEAL_RATE, SMALL_DEAL_RATE } from '../lib/commission';

/**
 * One source of truth for the money. The membership gate, the deal room and the
 * pricing screen all read from here, so the demo can't quote three different
 * numbers for the same thing.
 */
export const membershipPlan = {
  name: 'Sponsor membership',
  priceMonthly: 49,
  priceAnnual: 490,
  currency: '€',
  includes: [
    'Run the matching quiz and see your ranked, scored matches',
    'Contact any club or athlete you match with',
    'Unlimited re-ranking as your answers change',
    'Deal support through to signature',
    'Season reach reporting on live sponsorships',
  ],
  // Only the public directory is free for a sponsor — it's a plain list, not
  // a personalised search. The moment they want to be matched, they pay.
  freeTier: ['Browse the full public list of clubs and athletes'],
} as const;

export const commissionTiers = {
  threshold: COMMISSION_THRESHOLD,
  small: SMALL_DEAL_RATE,
  large: LARGE_DEAL_RATE,
} as const;

/** Clubs never pay. Commission is charged on top of the sponsorship. */
export const clubPromise =
  'Free to list, free to be matched, free to be contacted. The club receives the full agreed sponsorship — our commission is charged on top, to the sponsor.';
