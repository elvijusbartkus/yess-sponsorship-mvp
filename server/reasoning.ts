import Anthropic from '@anthropic-ai/sdk';
import type { Match, SponsorAnswers } from '../src/lib/types';
import { COUNTRY_LABEL } from '../src/lib/matching';

/**
 * The LLM writes the "why we matched you" text and NOTHING ELSE. Ranking,
 * scores, tax figures and cautions are all computed deterministically before we
 * get here, so a slow, failed or hallucinating model can never reorder matches
 * or invent a number — the worst case is that we fall back to template reasons.
 */

const MODEL = 'claude-opus-5';
const TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS ?? 9000);

export const llmEnabled = () =>
  process.env.USE_LLM_REASONS !== 'false' && Boolean(process.env.ANTHROPIC_API_KEY);

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

function factsFor(match: Match, answers: SponsorAnswers) {
  const p = match.profile;
  return {
    sponsor: {
      country: COUNTRY_LABEL[answers.country],
      budget: answers.budgetBand.label,
      wants_audience: answers.demographic,
      wants_visibility_in: answers.region,
      wants_in_return: answers.wants,
    },
    profile: {
      name: p.name,
      type: p.type,
      sport: p.sport,
      city: p.region,
      national_reach: p.isNational,
      audience: p.audienceSize,
      audience_corroborated: p.audienceCorroborated,
      corroboration: p.corroboration && {
        public_social_followers: p.corroboration.socialReach,
        press_mentions_per_year: p.corroboration.pressMentions,
        existing_sponsors: p.corroboration.existingSponsors,
      },
      demographics: p.demographics,
      what_sponsor_gets: p.activation,
      typical_deal_eur: p.dealRange,
      achievements: p.results,
    },
    computed_fit_score: match.score,
    computed_weakness: match.caution ?? null,
  };
}

const SYSTEM = `You write the "why we matched you" lines on a sport sponsorship marketplace.

You are given a sponsor's stated requirements and one club or athlete, both as structured facts, plus a fit score that has already been calculated.

Write 2 short reasons this is a good match, as a JSON array of 2 strings.

Rules:
- Use only the facts given. Never invent a number, a sponsor, an achievement, or a tax claim.
- Be specific: cite the actual figures and offerings from the facts.
- Be honest. If "computed_weakness" is present, one of your two reasons must acknowledge that weakness plainly rather than glossing over it.
- Do not mention the fit score itself.
- One sentence each, no more than 20 words. No bullets, no markdown, no preamble.
- Write plainly for a business owner, not a marketer. No hype adjectives.`;

async function reasonsFor(match: Match, answers: SponsorAnswers): Promise<string[] | null> {
  const response = await getClient().messages.create(
    {
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM,
      // Effort low: this is two short sentences from supplied facts, not a
      // reasoning problem. Keeps the demo snappy.
      output_config: {
        effort: 'low',
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: {
              reasons: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            required: ['reasons'],
            additionalProperties: false,
          },
        },
      },
      messages: [{ role: 'user', content: JSON.stringify(factsFor(match, answers)) }],
    },
    { timeout: TIMEOUT_MS },
  );

  if (response.stop_reason === 'refusal') return null;

  const text = response.content.find((b) => b.type === 'text');
  if (!text || text.type !== 'text') return null;

  const parsed = JSON.parse(text.text) as { reasons?: unknown };
  if (!Array.isArray(parsed.reasons)) return null;

  const reasons = parsed.reasons.filter((r): r is string => typeof r === 'string' && r.length > 0);
  return reasons.length ? reasons.slice(0, 3) : null;
}

/**
 * Rewrites each match's reasons using the model, in parallel. Any match whose
 * call fails, times out, or returns something unusable silently keeps its
 * template reasons — the demo never breaks on this path.
 */
export async function addModelReasons(
  matches: Match[],
  answers: SponsorAnswers,
): Promise<Match[]> {
  if (!llmEnabled() || matches.length === 0) return matches;

  const settled = await Promise.allSettled(matches.map((m) => reasonsFor(m, answers)));

  return matches.map((match, i) => {
    const outcome = settled[i];
    if (outcome.status === 'fulfilled' && outcome.value) {
      return { ...match, reasons: outcome.value, reasonsFromModel: true };
    }
    if (outcome.status === 'rejected') {
      console.warn(`[reasoning] fell back to templates for ${match.profile.id}:`, outcome.reason);
    }
    return { ...match, reasonsFromModel: false };
  });
}
