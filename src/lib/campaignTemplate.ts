import type { Profile } from './types';

export interface Campaign {
  post: string;
  story: string;
  fromModel: boolean;
}

/**
 * Shared by the browser and the server so the copy can't drift between them.
 * The server upgrades this with a live model call when a key is configured;
 * without one, this is what everybody sees.
 */
export function templateCampaign(sponsor: string, profile: Profile): Campaign {
  const who = profile.type === 'club' ? 'the club' : profile.name.split(' ')[0];
  return {
    post: `${profile.name} is proud to announce ${sponsor} as a partner for the season. Their backing keeps ${profile.sport.toLowerCase()} going in ${profile.region}, and puts ${sponsor} in front of every one of our supporters. Thank you.`,
    story: `${sponsor} × ${profile.name}. Backing ${who} this season.`,
    fromModel: false,
  };
}

/** Same deal, written in the sponsor's voice instead of the club's — the second variant. */
export function templateCampaignSponsorVoice(sponsor: string, profile: Profile): Campaign {
  const who = profile.type === 'club' ? profile.name : profile.name.split(' ')[0];
  return {
    post: `${sponsor} is backing ${who} this season. Real support for ${profile.sport.toLowerCase()} in ${profile.region}. Proud to be part of what they're building.`,
    story: `We're backing ${who}. ${sponsor} × ${profile.name}.`,
    fromModel: false,
  };
}
