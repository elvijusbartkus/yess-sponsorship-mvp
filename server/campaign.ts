import Anthropic from '@anthropic-ai/sdk';
import type { Profile } from '../src/lib/types';

/**
 * The curation layer: we don't just introduce a sponsor and a club, we draft and
 * run the marketing between them. Clubs and athletes are training, not selling
 * themselves — so the platform writes the campaign.
 *
 * Same rule as match reasoning: the model writes copy and nothing else, and a
 * failed call falls back to a template so the demo never breaks.
 */

const MODEL = 'claude-opus-5';
const TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS ?? 9000);

export interface Campaign {
  post: string;
  story: string;
  fromModel: boolean;
}

export const campaignLlmEnabled = () =>
  process.env.USE_LLM_REASONS !== 'false' && Boolean(process.env.ANTHROPIC_API_KEY);

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

const SYSTEM = `You write social copy for sport sponsorships on a Baltic marketplace.

Given a sponsor and the club or athlete they are sponsoring, write:
- "post": one social post announcing the sponsorship, from the club's voice. Max 240 characters.
- "story": one short story caption, max 90 characters.

Rules:
- Use only the facts given. Never invent results, figures, or claims.
- Warm and concrete, not corporate. No hashtag spam — at most two.
- Name both the sponsor and the club.
- No emoji in the post; at most one in the story.`;

function template(sponsor: string, profile: Profile): Campaign {
  const who = profile.type === 'club' ? 'the club' : profile.name.split(' ')[0];
  return {
    post: `${profile.name} is proud to announce ${sponsor} as a partner for the season. Their backing keeps ${profile.sport.toLowerCase()} going in ${profile.region} — and puts ${sponsor} in front of every one of our supporters. Thank you.`,
    story: `${sponsor} × ${profile.name}. Backing ${who} this season.`,
    fromModel: false,
  };
}

export async function draftCampaign(sponsor: string, profile: Profile): Promise<Campaign> {
  if (!campaignLlmEnabled()) return template(sponsor, profile);

  try {
    const response = await getClient().messages.create(
      {
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM,
        output_config: {
          effort: 'low',
          format: {
            type: 'json_schema',
            schema: {
              type: 'object',
              properties: { post: { type: 'string' }, story: { type: 'string' } },
              required: ['post', 'story'],
              additionalProperties: false,
            },
          },
        },
        messages: [
          {
            role: 'user',
            content: JSON.stringify({
              sponsor,
              club: {
                name: profile.name,
                type: profile.type,
                sport: profile.sport,
                city: profile.region,
                audience: profile.audienceSize,
                offers: profile.activation,
                achievements: profile.results,
              },
            }),
          },
        ],
      },
      { timeout: TIMEOUT_MS },
    );

    if (response.stop_reason === 'refusal') return template(sponsor, profile);
    const text = response.content.find((b) => b.type === 'text');
    if (!text || text.type !== 'text') return template(sponsor, profile);

    const parsed = JSON.parse(text.text) as { post?: unknown; story?: unknown };
    if (typeof parsed.post !== 'string' || typeof parsed.story !== 'string') {
      return template(sponsor, profile);
    }
    return { post: parsed.post, story: parsed.story, fromModel: true };
  } catch (error) {
    console.warn('[campaign] falling back to template:', error);
    return template(sponsor, profile);
  }
}
