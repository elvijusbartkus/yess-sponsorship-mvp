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
    value: 'verified-audience',
    label: 'Biggest verified audience',
    hint: 'Numbers proven at the gate, not self-reported',
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

export const quizSteps = [
  {
    id: 'country',
    title: 'Where does your business operate?',
    subtitle: 'So we match you to sport your customers actually follow.',
  },
  {
    id: 'budget',
    title: "What's your budget for this sponsorship?",
    subtitle: 'A range is fine. Free to browse, free to connect.',
  },
  {
    id: 'demographic',
    title: 'Who are you trying to reach?',
    subtitle: 'The audience that matters to your business.',
  },
  {
    id: 'region',
    title: 'Where do you want to be visible?',
    subtitle: 'A specific city, or right across the country.',
  },
  {
    id: 'wants',
    title: 'What do you want in return?',
    subtitle: 'We rank clubs by what they can actually deliver.',
  },
  {
    id: 'priority',
    title: 'What matters most in who you back?',
    subtitle: 'This re-ranks your matches. You can change it later.',
  },
] as const;

export type QuizStepId = (typeof quizSteps)[number]['id'];
