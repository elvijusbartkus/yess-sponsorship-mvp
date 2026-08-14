import type { Profile, ProfileDraft } from './types';

/**
 * Turns what the club/athlete flow collects into a matchable profile, so a
 * self-listed club is discoverable by sponsors in the same session.
 *
 * Everything the builder does not ask for is filled conservatively rather than
 * flatteringly:
 *  - demographics default to the 'all' wildcard, because we did not ask who
 *    they reach and must not invent a segment for them
 *  - audienceVerified is false — this is self-reported by definition
 *  - tax status is 'none', since recipient status is a legal fact we would have
 *    to check, not something a club can claim in a signup form
 */
export function profileFromDraft(draft: ProfileDraft, index: number): Profile {
  return {
    id: `self-listed-${index}-${draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: draft.name,
    type: draft.type,
    sport: draft.sport,
    country: draft.country,
    region: draft.region,
    isNational: false,
    audienceSize: draft.audienceSize + draft.instagramFollowers,
    audienceVerified: false,
    demographics: ['all'],
    reach: {
      matchAttendance: draft.type === 'club' ? draft.audienceSize : 0,
      instagramFollowers: draft.instagramFollowers,
      facebookFans: 0,
      pressMentions: 0,
    },
    results: `Self-listed on the marketplace. ${
      draft.type === 'club' ? 'Club' : 'Athlete'
    } profile, not yet independently verified.`,
    activation: draft.activation,
    dealRange: draft.dealRange,
    taxStatus: {
      hasSponsorshipStatus: false,
      benefit: { kind: 'none' },
      note: 'Recipient status not yet confirmed for this profile — treated as ordinary marketing spend until checked.',
    },
    currentSponsors: [],
    imageHint: `${draft.sport} in ${draft.region}`,
  };
}
