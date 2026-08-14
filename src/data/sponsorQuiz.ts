import type {
  ActivationType,
  BudgetBand,
  Country,
  Demographic,
  Priority,
  Region,
} from '../lib/types';

export const budgetBands: BudgetBand[] = [
  { id: 'b1', label: '€500 – €2,000', min: 500, max: 2000, midpoint: 1250 },
  { id: 'b2', label: '€2,000 – €10,000', min: 2000, max: 10000, midpoint: 6000 },
  { id: 'b3', label: '€10,000 – €50,000', min: 10000, max: 50000, midpoint: 30000 },
  { id: 'b4', label: '€50,000+', min: 50000, max: 150000, midpoint: 75000 },
];

export const countryOptions: { value: Country; label: string }[] = [
  { value: 'EE', label: 'Estonia' },
  { value: 'LV', label: 'Latvia' },
  { value: 'LT', label: 'Lithuania' },
];

export const regionsByCountry: Record<Country, Region[]> = {
  EE: ['Tallinn', 'Tartu', 'Pärnu', 'Narva'],
  LV: ['Riga', 'Liepāja'],
  LT: ['Vilnius', 'Kaunas'],
};

export const demographicOptions: { value: Demographic; label: string; hint: string }[] = [
  { value: 'youth', label: 'Youth', hint: 'Under 18 and their parents' },
  { value: '18-34', label: '18–34', hint: 'Young adults' },
  { value: '35-54', label: '35–54', hint: 'Established professionals' },
  { value: 'families', label: 'Families', hint: 'Households with children' },
  { value: 'all', label: 'Broad audience', hint: 'No specific segment' },
];

/**
 * Replaces the old "goal" question, which restated the region and demographic
 * answers. This one asks something they alone can answer, and matches directly
 * against what each club can actually deliver.
 */
export const wantsOptions: { value: ActivationType | 'any'; label: string; hint: string }[] = [
  {
    value: 'visibility',
    label: 'Our logo in front of people',
    hint: 'Shirts, boards, venue and broadcast',
  },
  {
    value: 'content',
    label: 'Content we can use',
    hint: 'Social posts, athlete stories, newsletters',
  },
  {
    value: 'hospitality',
    label: 'Access and hospitality',
    hint: 'Matchday guests, appearances, client entertaining',
  },
  {
    value: 'naming',
    label: 'Our name on something',
    hint: 'A team, an event or an academy carrying your brand',
  },
  { value: 'any', label: "We're open", hint: 'Show us what each one offers' },
];

export const priorityOptions: { value: Priority; label: string; hint: string }[] = [
  {
    value: 'corroborated-audience',
    label: 'Best-corroborated audience',
    hint: 'Figures we could check against public data',
  },
  {
    value: 'value-for-money',
    label: 'Best value for money',
    hint: 'Most people reached per euro spent',
  },
  {
    value: 'local-story',
    label: 'Strongest local story',
    hint: 'A community club your customers actually know',
  },
];

/**
 * Three taps. The country comes from the sponsor's account, and the two
 * refinement questions ("what do you want in return", "what matters most")
 * moved to live chips on the results screen — they're more convincing there,
 * where you can watch the ranking move, and they don't slow the funnel.
 */
export const quizSteps = [
  {
    id: 'budget',
    title: "What's your budget?",
    subtitle: 'A range is fine.',
  },
  {
    id: 'demographic',
    title: 'Who do you want to reach?',
    subtitle: 'The audience that matters to your business.',
  },
  {
    id: 'region',
    title: 'Where?',
    subtitle: 'A city, or the whole country.',
  },
  {
    id: 'country',
    title: 'Where does your business operate?',
    subtitle: 'Only asked if we don\'t already know.',
  },
] as const;

export type QuizStepId = (typeof quizSteps)[number]['id'];
