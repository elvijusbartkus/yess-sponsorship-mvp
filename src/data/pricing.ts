import { COMMISSION_RATE, LAUNCH_PROMO_COMMISSION_RATE } from '../lib/commission';

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
  /** Standard rate once the launch offer ends. Flat — no size tiers. */
  standard: COMMISSION_RATE,
  /** Rate during the launch window. */
  launch: LAUNCH_PROMO_COMMISSION_RATE,
} as const;

/**
 * The go-to-market offer: cheaper (or free) for the first stretch, so early
 * clubs and sponsors aren't paying full price before the marketplace has
 * proven itself to them.
 */
export const launchPromo = {
  active: true,
  clubFreeMonths: 1,
  sponsorFreeMonths: 2,
  commissionRate: LAUNCH_PROMO_COMMISSION_RATE,
} as const;

export const clubPromise = `${clubPlan.currency}${clubPlan.priceMonthly}/month (or ${clubPlan.currency}${clubPlan.priceAnnual}/year) to list, be matched, and be contacted — the first ${launchPromo.clubFreeMonths} month free at launch. The club receives the full agreed sponsorship; commission is charged on top, to the sponsor.`;
