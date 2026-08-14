import type { Demographic, Match, Profile, SponsorAnswers } from './types';
import { computeTaxBenefit } from './taxRules';

/**
 * Genuinely adjacent audiences only. Deliberately narrow: a youth club must
 * score LOW in a 35-54 search, not "partial", or the ranking stops meaning
 * anything.
 */
const ADJACENT: Record<Demographic, Demographic[]> = {
  youth: ['families'],
  families: ['youth'],
  '18-34': ['35-54'],
  '35-54': ['18-34'],
  all: [],
};

export const COUNTRY_LABEL: Record<string, string> = {
  EE: 'Estonia',
  LV: 'Latvia',
  LT: 'Lithuania',
};

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

export function scoreDemographic(answers: SponsorAnswers, profile: Profile): number {
  if (profile.demographics.includes(answers.demographic)) return 40;
  if (profile.demographics.includes('all')) return 26;
  const adjacent = ADJACENT[answers.demographic] ?? [];
  if (profile.demographics.some((d) => adjacent.includes(d))) return 16;
  return 0;
}

export function scoreGeography(answers: SponsorAnswers, profile: Profile): number {
  if (answers.country !== profile.country) return 0;
  if (answers.region === 'National') return profile.isNational ? 30 : 6;
  if (answers.region === profile.region) return 30;
  if (profile.isNational) return 18;
  return 5;
}

export function scoreBudget(answers: SponsorAnswers, profile: Profile): number {
  const [min, max] = profile.dealRange;
  const { min: bandMin, max: bandMax } = answers.budgetBand;
  // Overlap between the sponsor's band and the profile's typical deal range.
  if (bandMax >= min && bandMin <= max) return 20;
  if (bandMax >= min * 0.6 && bandMin <= max * 1.4) return 9;
  return 0;
}

export function scoreGoal(answers: SponsorAnswers, profile: Profile): number {
  switch (answers.goal) {
    case 'youth-engagement':
      return profile.demographics.includes('youth') ? 10 : 3;
    case 'national-reach':
      return profile.isNational ? 10 : 3;
    case 'local-presence':
      return !profile.isNational ? 10 : 3;
    case 'brand-awareness':
      if (profile.audienceSize >= 10000) return 10;
      return profile.audienceSize >= 1000 ? 7 : 3;
    default:
      return 3;
  }
}

/**
 * Optional 6th question. Weighted heavily enough that the ranking visibly
 * reorders, not just nudges — a tie-breaker nobody can see is theatre.
 */
export function scorePriority(answers: SponsorAnswers, profile: Profile): number {
  if (!answers.priority) return 0;
  switch (answers.priority) {
    case 'verified-audience':
      return profile.audienceVerified ? 22 : 0;
    case 'value-for-money': {
      // People reached per euro at the entry end of their deal range.
      const perEuro = profile.audienceSize / Math.max(profile.dealRange[0], 1);
      if (perEuro >= 2) return 22;
      if (perEuro >= 0.8) return 14;
      return perEuro >= 0.4 ? 6 : 0;
    }
    case 'local-story':
      if (profile.isNational) return 0;
      return profile.audienceSize < 2000 ? 22 : 12;
    default:
      return 0;
  }
}

function geographyPhrase(
  answers: SponsorAnswers,
  profile: Profile,
  geography: number,
): string {
  if (answers.region === 'National') {
    return geography >= 30
      ? `across ${COUNTRY_LABEL[profile.country]}`
      : `from ${profile.region}`;
  }
  if (geography >= 30) return `in ${answers.region}`;
  if (profile.isNational) return `nationally, including ${answers.region}`;
  return `from ${profile.region}`;
}

interface Parts {
  demographic: number;
  geography: number;
  budget: number;
  goal: number;
  priority: number;
  verified: number;
}

/**
 * Reasons must describe THIS profile's actual top-scoring factors, in its own
 * concrete numbers. No boilerplate repeated across cards — if every card says
 * the same thing, the matching looks fake, which is worse than saying less.
 */
function buildReasons(answers: SponsorAnswers, profile: Profile, parts: Parts): string[] {
  const candidates: { weight: number; text: string }[] = [];
  const place = geographyPhrase(answers, profile, parts.geography);

  if (parts.demographic >= 40) {
    candidates.push({
      weight: 100,
      text: `Their ${DEMOGRAPHIC_LABEL[answers.demographic]} audience is exactly who you asked for, ${place}`,
    });
  } else if (parts.demographic >= 26) {
    candidates.push({
      weight: 70,
      text: `Broad audience ${place} that includes your ${DEMOGRAPHIC_LABEL[answers.demographic]} target`,
    });
  } else if (parts.demographic > 0) {
    candidates.push({
      weight: 40,
      text: `${profile.demographics.map((d) => DEMOGRAPHIC_LABEL[d]).join(' and ')} audience — adjacent to your ${DEMOGRAPHIC_LABEL[answers.demographic]} target, not a direct hit`,
    });
  }

  if (parts.geography >= 30 && answers.region !== 'National') {
    candidates.push({
      weight: 90,
      text: `Based in ${profile.region}, the city you want to own`,
    });
  } else if (parts.geography >= 30) {
    candidates.push({
      weight: 90,
      text: `National reach across ${COUNTRY_LABEL[profile.country]}, with ${profile.reach.pressMentions} press mentions a year`,
    });
  } else if (parts.geography >= 18) {
    candidates.push({
      weight: 55,
      text: `National footprint that still puts you in front of ${answers.region}`,
    });
  }

  if (parts.budget === 20) {
    candidates.push({
      weight: 80,
      text: `Deals here typically run €${profile.dealRange[0].toLocaleString('en-US')}–€${profile.dealRange[1].toLocaleString('en-US')}, overlapping your ${answers.budgetBand.label}`,
    });
  } else if (parts.budget === 9) {
    candidates.push({
      weight: 35,
      text: `Usually €${profile.dealRange[0].toLocaleString('en-US')}–€${profile.dealRange[1].toLocaleString('en-US')} — close to your budget, likely negotiable`,
    });
  }

  if (parts.goal >= 10) {
    const detail =
      answers.goal === 'brand-awareness'
        ? `${profile.audienceSize.toLocaleString('en-US')} people reached across matchday and social`
        : answers.goal === 'youth-engagement'
          ? `${profile.type === 'club' ? 'A youth programme' : 'A young following'} you can put your name on`
          : answers.goal === 'national-reach'
            ? `${profile.reach.pressMentions} press mentions a year plus broadcast exposure`
            : `Rooted in ${profile.region} rather than spread thin nationally`;
    candidates.push({ weight: 60, text: `Strong for ${GOAL_LABEL[answers.goal]}: ${detail}` });
  }

  if (parts.priority > 0 && answers.priority === 'verified-audience') {
    candidates.push({
      weight: 75,
      text: `Audience of ${profile.audienceSize.toLocaleString('en-US')} is verified at the gate, not self-reported`,
    });
  } else if (parts.priority > 0 && answers.priority === 'value-for-money') {
    candidates.push({
      weight: 75,
      text: `About ${Math.round(profile.audienceSize / Math.max(profile.dealRange[0], 1)).toLocaleString('en-US')} people reached per euro at their entry deal size`,
    });
  } else if (parts.priority > 0 && answers.priority === 'local-story') {
    candidates.push({
      weight: 75,
      text: `A genuine ${profile.region} story — ${profile.results.split(';')[0].toLowerCase()}`,
    });
  }

  return candidates
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((c) => c.text);
}

/** Say so honestly when a match is weak, rather than dressing it up. */
function buildCaution(parts: Parts, score: number): string | undefined {
  if (parts.demographic === 0) {
    return 'Audience does not overlap your target — included only because the other factors fit.';
  }
  if (parts.demographic <= 16 && score < 55) {
    return 'Adjacent audience rather than a direct match — worth a look, not a first call.';
  }
  if (parts.budget === 0) {
    return 'Their typical deal size sits outside your budget band.';
  }
  return undefined;
}

export function matchSponsorToProfiles(
  answers: SponsorAnswers,
  allProfiles: Profile[] = [],
): Match[] {
  return allProfiles
    // Sponsors are matched inside their own market. Scoring geography at zero
    // is not enough on its own — a foreign profile can still accumulate
    // demographic, budget and goal points and leak into the results.
    .filter((profile) => profile.country === answers.country)
    .map((profile) => {
      const parts: Parts = {
        demographic: scoreDemographic(answers, profile),
        geography: scoreGeography(answers, profile),
        budget: scoreBudget(answers, profile),
        goal: scoreGoal(answers, profile),
        priority: scorePriority(answers, profile),
        verified: profile.audienceVerified ? 5 : 0,
      };

      const raw =
        parts.demographic +
        parts.geography +
        parts.budget +
        parts.goal +
        parts.priority +
        parts.verified;

      // Clamp, never rescale: a perfect fit must read as a high number.
      // But audience is the point of the whole exercise, so a profile that
      // does not reach the target at all is capped no matter how well the
      // other factors score. Otherwise a card can show 87 next to "audience
      // does not overlap your target", which is a straight contradiction.
      let score = Math.min(100, raw);
      if (parts.demographic === 0) score = Math.min(score, 45);
      else if (parts.demographic <= 16) score = Math.min(score, 72);

      return {
        profile,
        score,
        reasons: buildReasons(answers, profile, parts),
        caution: buildCaution(parts, score),
        taxBenefit: computeTaxBenefit(answers.budget, profile),
        verifiedBadge: profile.audienceVerified,
      };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || b.profile.audienceSize - a.profile.audienceSize)
    .slice(0, 5);
}
