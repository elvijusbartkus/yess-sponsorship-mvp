import type { BudgetBand, Country, Demographic, Goal, Region } from '../lib/types';

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

export const goalOptions: { value: Goal; label: string; hint: string }[] = [
  { value: 'brand-awareness', label: 'Brand awareness', hint: 'Be seen by as many people as possible' },
  { value: 'local-presence', label: 'Local presence', hint: 'Own a city or region' },
  { value: 'youth-engagement', label: 'Youth engagement', hint: 'Reach young people and their families' },
  { value: 'national-reach', label: 'National reach', hint: 'Country-wide visibility and broadcast' },
];

export const quizSteps = [
  { id: 'country', title: 'Where does your business operate?', subtitle: 'This determines which tax relief applies to your sponsorship.' },
  { id: 'budget', title: 'What is your sponsorship budget?', subtitle: 'A range is fine — we price the tax benefit against it.' },
  { id: 'demographic', title: 'Who are you trying to reach?', subtitle: 'The audience that matters to your business.' },
  { id: 'region', title: 'Where do you want to be visible?', subtitle: 'A specific city, or nationally.' },
  { id: 'goal', title: "What's the goal of this sponsorship?", subtitle: 'We weight matches toward what you actually want.' },
] as const;

export type QuizStepId = (typeof quizSteps)[number]['id'];
