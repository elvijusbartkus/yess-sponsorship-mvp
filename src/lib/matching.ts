import type { Demographic, Match, Profile, SponsorAnswers } from './types';
import { computeTaxBenefit } from './taxRules';

/** Explicit adjacency table — no interpretation, no drift between implementations. */
const ADJACENT: Record<Demographic, Demographic[]> = {
  youth: ['families'],
  families: ['youth', '35-54'],
  '18-34': ['35-54'],
  '35-54': ['18-34', 'families'],
  all: [],
};

export function scoreDemographic(answers: SponsorAnswers, profile: Profile): number {
  if (profile.demographics.includes(answers.demographic)) return 40;
  if (profile.demographics.includes('all')) return 28;
  const adjacent = ADJACENT[answers.demographic] ?? [];
  if (profile.demographics.some((d) => adjacent.includes(d))) return 20;
  return 0;
}

/** Cross-border never scores. This is what keeps a Tartu gym off a Vilnius club. */
export function scoreGeography(answers: SponsorAnswers, profile: Profile): number {
  if (answers.country !== profile.country) return 0;
  if (answers.region === 'National') return profile.isNational ? 30 : 8;
  if (answers.region === profile.region) return 30;
  if (profile.isNational) return 20;
  return 8;
}

export function scoreBudget(answers: SponsorAnswers, profile: Profile): number {
  const [min, max] = profile.dealRange;
  const budget = answers.budget;
  if (budget >= min && budget <= max) return 20;
  if (budget < min && budget >= min * 0.5) return 10;
  if (budget > max && budget <= max * 1.5) return 10;
  return 0;
}

export function scoreGoal(answers: SponsorAnswers, profile: Profile): number {
  switch (answers.goal) {
    case 'youth-engagement':
      return profile.demographics.includes('youth') ? 10 : 4;
    case 'national-reach':
      return profile.isNational ? 10 : 4;
    case 'local-presence':
      return !profile.isNational ? 10 : 4;
    case 'brand-awareness':
      return profile.audienceSize >= 1000 ? 10 : 4;
    default:
      return 4;
  }
}

function taxBonus(profile: Profile): number {
  if (profile.taxStatus.benefit.kind === 'multiplier') return 8;
  if (profile.taxStatus.benefit.kind === 'allowance') return 4;
  return 0;
}

/**
 * Name the geography honestly. If the profile is not actually where the sponsor
 * asked for, say where it IS — a Tallinn club must never be described as
 * reaching an audience "in Tartu".
 */
function regionLabel(answers: SponsorAnswers, profile: Profile, geographyScore: number): string {
  if (answers.region === 'National') return 'nationally';
  if (geographyScore >= 30) return `in ${answers.region}`;
  if (profile.isNational) return `nationally, including ${answers.region}`;
  return `from ${profile.region}`;
}

const DEMOGRAPHIC_LABEL: Record<Demographic, string> = {
  youth: 'youth',
  '18-34': '18–34',
  '35-54': '35–54',
  families: 'family',
  all: 'broad',
};

const GOAL_LABEL: Record<SponsorAnswers['goal'], string> = {
  'brand-awareness': 'brand awareness',
  'local-presence': 'local presence',
  'youth-engagement': 'youth engagement',
  'national-reach': 'national reach',
};

function buildReasons(
  answers: SponsorAnswers,
  profile: Profile,
  parts: { demographic: number; geography: number; budget: number; goal: number },
): string[] {
  const candidates: { weight: number; text: string }[] = [];

  if (parts.demographic >= 28) {
    candidates.push({
      weight: parts.demographic,
      text: `Reaches your target ${DEMOGRAPHIC_LABEL[answers.demographic]} audience ${regionLabel(answers, profile, parts.geography)}`,
    });
  } else if (parts.demographic > 0) {
    candidates.push({
      weight: parts.demographic,
      text: `Adjacent audience overlap with ${DEMOGRAPHIC_LABEL[answers.demographic]}`,
    });
  }

  if (parts.geography >= 30) {
    candidates.push({
      weight: parts.geography,
      text:
        answers.region === 'National'
          ? `National footprint across ${profile.country === 'EE' ? 'Estonia' : profile.country === 'LV' ? 'Latvia' : 'Lithuania'}`
          : `Based in ${profile.region}, exactly where you want visibility`,
    });
  } else if (parts.geography >= 20) {
    candidates.push({
      weight: parts.geography,
      text: `National reach that covers ${answers.region}`,
    });
  }

  if (parts.budget === 20) {
    candidates.push({
      weight: parts.budget,
      text: `Your ${answers.budgetBand.label} budget sits inside their typical deal range`,
    });
  } else if (parts.budget === 10) {
    candidates.push({
      weight: parts.budget,
      text: `Close to their deal range — negotiable at your budget`,
    });
  }

  if (parts.goal === 10) {
    candidates.push({
      weight: parts.goal,
      text: `Strong fit for ${GOAL_LABEL[answers.goal]}`,
    });
  }

  if (profile.audienceVerified) {
    candidates.push({
      weight: 5,
      text: `Audience of ${profile.audienceSize.toLocaleString('en-US')} is verified, not self-reported`,
    });
  }

  return candidates
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((c) => c.text);
}

export function matchSponsorToProfiles(
  answers: SponsorAnswers,
  allProfiles: Profile[] = [],
): Match[] {
  return allProfiles
    // Hard market boundary. Geography scoring alone is not enough: a foreign
    // profile could still accumulate demographic + budget + goal points and
    // leak into an Estonian sponsor's results. Sponsors see their own market.
    .filter((profile) => profile.country === answers.country)
    .map((profile) => {
      const parts = {
        demographic: scoreDemographic(answers, profile),
        geography: scoreGeography(answers, profile),
        budget: scoreBudget(answers, profile),
        goal: scoreGoal(answers, profile),
      };

      const raw =
        parts.demographic +
        parts.geography +
        parts.budget +
        parts.goal +
        taxBonus(profile) +
        (profile.audienceVerified ? 4 : 0);

      // Clamp, never rescale: a perfect audience match without tax status must
      // still read as a high number, not 91%.
      const score = Math.min(100, raw);

      return {
        profile,
        score,
        reasons: buildReasons(answers, profile, parts),
        taxBenefit: computeTaxBenefit(answers.budget, profile),
        verifiedBadge: profile.audienceVerified,
      };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || b.profile.audienceSize - a.profile.audienceSize)
    .slice(0, 5);
}
