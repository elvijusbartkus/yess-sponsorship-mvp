import type { ActivationType, ClubSeed, Country, Region } from '../lib/types';

export const sportOptions = [
  'Football',
  'Basketball',
  'Handball',
  'Volleyball',
  'Ice hockey',
  'Athletics',
  'Cycling',
  'Swimming',
  'Other',
];

export const activationOptions = [
  'Kit branding',
  'Venue banners',
  'Social posts',
  'Named event',
  'Newsletter',
  'Hospitality',
];

/** Lets a self-listed club be matched on what it offers, like the seed data. */
export const activationTypeOf: Record<string, ActivationType> = {
  // Club options
  'Kit branding': 'visibility',
  'Venue banners': 'visibility',
  'Named event': 'naming',
  'Matchday hospitality': 'hospitality',
  'Social posts': 'content',
  Newsletter: 'content',
  // Athlete options
  'Kit / race branding': 'visibility',
  Appearances: 'hospitality',
  'Content series': 'content',
  'Coaching sessions': 'hospitality',
  // Legacy label, kept so older seeds still map
  Hospitality: 'hospitality',
};

/** Clubs count people through a gate; athletes count a following. */
export const clubAudienceBands = [
  { id: 'a1', label: 'Under 200 at a home game', value: 300 },
  { id: 'a2', label: '200 – 1,000', value: 1200 },
  { id: 'a3', label: '1,000 – 5,000', value: 5000 },
  { id: 'a4', label: '5,000+', value: 20000 },
];

export const athleteAudienceBands = [
  { id: 'a1', label: 'Under 1,000 following', value: 800 },
  { id: 'a2', label: '1,000 – 10,000', value: 5000 },
  { id: 'a3', label: '10,000 – 50,000', value: 25000 },
  { id: 'a4', label: '50,000+', value: 80000 },
];

/** Athletes only — a sponsor buys the level as much as the numbers. */
export const competitionLevels = [
  { value: 'national-team', label: 'National team', hint: 'Represented your country' },
  { value: 'top-league', label: 'Top national league', hint: 'Senior first division' },
  { value: 'regional', label: 'Regional or second tier', hint: 'Competing seriously' },
  { value: 'rising', label: 'Rising / junior', hint: 'On the way up' },
];

/** Clubs only — what a sponsor is actually buying into. */
export const clubActivations = [
  'Kit branding',
  'Venue banners',
  'Named event',
  'Matchday hospitality',
  'Social posts',
  'Newsletter',
];

/** Athletes only — an individual sells access and content, not a stadium. */
export const athleteActivations = [
  'Kit / race branding',
  'Social posts',
  'Appearances',
  'Content series',
  'Coaching sessions',
  'Named event',
];

export const dealRangeOptions: { id: string; label: string; value: [number, number] }[] = [
  { id: 'd1', label: '€500 – €2,000', value: [500, 2000] },
  { id: 'd2', label: '€2,000 – €10,000', value: [2000, 10000] },
  { id: 'd3', label: '€10,000 – €50,000', value: [10000, 50000] },
  { id: 'd4', label: '€50,000+', value: [50000, 150000] },
];

export const socialBands = [
  { id: 's0', label: 'Not on social yet', value: 0 },
  { id: 's1', label: 'Under 1,000', value: 600 },
  { id: 's2', label: '1,000 – 10,000', value: 4500 },
  { id: 's3', label: '10,000+', value: 25000 },
];

export const clubRegionsByCountry: Record<Country, Region[]> = {
  EE: ['Tallinn', 'Tartu', 'Pärnu', 'Narva'],
  LV: ['Riga', 'Liepāja'],
  LT: ['Vilnius', 'Kaunas'],
};

/** Quick-starts so the club flow can be demoed without typing on stage. */
export const clubSeeds: ClubSeed[] = [
  {
    id: 'viljandi-fc',
    label: 'Small football club',
    blurb: 'Tartu, ~1,200 matchday, needs €2–10k',
    draft: {
      name: 'FC Tartu Kalev',
      type: 'club',
      sport: 'Football',
      country: 'EE',
      region: 'Tartu',
      audienceSize: 1200,
      instagramFollowers: 4500,
      activation: ['Kit branding', 'Venue banners', 'Social posts'],
      activationTypes: ['visibility', 'content'],
      dealRange: [2000, 10000],
    },
  },
  {
    id: 'young-swimmer',
    label: 'Rising athlete',
    blurb: 'Tallinn swimmer, 4.5k following, needs €500–2k',
    draft: {
      name: 'Marta Sepp',
      type: 'athlete',
      sport: 'Swimming',
      country: 'EE',
      region: 'Tallinn',
      audienceSize: 5000,
      instagramFollowers: 4500,
      activation: ['Social posts', 'Named event', 'Hospitality'],
      activationTypes: ['content', 'naming', 'hospitality'],
      dealRange: [500, 2000],
    },
  },
];
