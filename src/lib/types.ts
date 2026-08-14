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

/**
 * What the sponsor actually gets. Replaces the old `Goal`, which restated the
 * region and demographic answers rather than adding anything, and lets the
 * matcher finally use each profile's activation options.
 */
export type ActivationType = 'visibility' | 'content' | 'hospitality' | 'naming';

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
  /** Categorised form of `activation`, so it can be matched on. */
  activationTypes: ActivationType[];
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

/** Optional 6th question — re-weights the ranking so the matching visibly responds. */
export type Priority = 'verified-audience' | 'value-for-money' | 'local-story';

export interface SponsorAnswers {
  budgetBand: BudgetBand;
  /** budgetBand.midpoint — the number the scoring and tax maths run on. */
  budget: number;
  country: Country;
  demographic: Demographic;
  /** 'National' means national within `country`. */
  region: Region | 'National';
  /** 'any' = no preference. */
  wants: ActivationType | 'any';
  priority?: Priority;
}

/**
 * A restrained, honest tax note. `applies: false` means there is genuinely no
 * enhanced relief — the UI must then show no euro saving at all.
 */
export interface MatchTaxBenefit {
  applies: boolean;
  /** Short tag for the card — no euro figure, so cards don't all read alike. */
  tag: string;
  /** The fuller line, detail screen only. */
  line: string;
  deduction: number;
  taxSaved: number;
  realCost: number;
  /** Detail screen only. */
  caveat: string;
}

export interface Match {
  profile: Profile;
  score: number;
  /** Specific to this profile's actual top-scoring factors. Never boilerplate. */
  reasons: string[];
  /** Honest note when the fit is only adjacent, shown on weaker matches. */
  caution?: string;
  taxBenefit: MatchTaxBenefit;
  verifiedBadge: boolean;
}

export interface Persona {
  id: string;
  label: string;
  blurb: string;
  answers: SponsorAnswers;
}

/** What the club/athlete flow collects. Deliberately short. */
export interface ProfileDraft {
  name: string;
  type: 'club' | 'athlete';
  sport: string;
  country: Country;
  region: Region;
  audienceSize: number;
  instagramFollowers: number;
  activation: string[];
  /** Categorised form of `activation`, so it can be matched on. */
  activationTypes: ActivationType[];
  dealRange: [number, number];
}

export interface ClubSeed {
  id: string;
  label: string;
  blurb: string;
  draft: ProfileDraft;
}
