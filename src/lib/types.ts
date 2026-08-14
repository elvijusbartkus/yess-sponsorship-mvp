export type Country = 'EE' | 'LV' | 'LT';

/**
 * Regions are city-level only. "National" is deliberately NOT a region: it is a
 * flag on the profile, scoped by country, so that a national Estonian athlete
 * and a national Lithuanian club are never treated as the same geography.
 */
export type Region =
  | 'Tallinn'
  | 'Tartu'
  | 'Pärnu'
  | 'Narva'
  | 'Riga'
  | 'Liepāja'
  | 'Vilnius'
  | 'Kaunas';

export type Demographic = 'youth' | '18-34' | '35-54' | 'families' | 'all';

export type Goal =
  | 'brand-awareness'
  | 'local-presence'
  | 'youth-engagement'
  | 'national-reach';

/**
 * Tax benefit is a discriminated union on purpose. Lithuania's "deduct twice the
 * amount from the taxable base" and Estonia's "this is tax-free within an
 * allowance" are different legal mechanisms and must not share one numeric
 * multiplier field.
 */
export type TaxBenefit =
  | { kind: 'multiplier'; factor: number; corporateTaxRate: number }
  | { kind: 'allowance'; corporateTaxRate: number }
  | { kind: 'none' };

export interface Profile {
  id: string;
  name: string;
  type: 'club' | 'athlete';
  sport: string;
  country: Country;
  region: Region;
  /** National reach WITHIN its own country. */
  isNational: boolean;
  audienceSize: number;
  /** true = verified via the trust layer, false = self-reported */
  audienceVerified: boolean;
  demographics: Demographic[];
  reach: {
    matchAttendance: number;
    instagramFollowers: number;
    facebookFans: number;
    pressMentions: number;
  };
  results: string;
  activation: string[];
  dealRange: [number, number];
  taxStatus: {
    hasSponsorshipStatus: boolean;
    benefit: TaxBenefit;
    note: string;
  };
  currentSponsors: string[];
  imageHint: string;
}

export interface BudgetBand {
  id: string;
  label: string;
  min: number;
  max: number;
  midpoint: number;
}

export interface SponsorAnswers {
  budgetBand: BudgetBand;
  /** budgetBand.midpoint — the number the scoring and tax maths run on. */
  budget: number;
  country: Country;
  demographic: Demographic;
  /** 'National' means national within `country`. */
  region: Region | 'National';
  goal: Goal;
}

export interface MatchTaxBenefit {
  headline: string;
  subline: string;
  deductibleAmount: number;
  cashSaving: number;
  /** Rendered on the detail screen only — the card stays clean. */
  caveat: string;
}

export interface Match {
  profile: Profile;
  score: number;
  reasons: string[];
  taxBenefit: MatchTaxBenefit;
  verifiedBadge: boolean;
}

export interface Persona {
  id: string;
  label: string;
  blurb: string;
  answers: SponsorAnswers;
}
