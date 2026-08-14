import type { Persona } from '../lib/types';
import { budgetBands } from './sponsorQuiz';

/**
 * Illustrative sponsor archetypes, not real companies with a live interest —
 * same honesty rule as the club side's demand signal. Used to show a
 * club/athlete which *kinds* of local businesses would be a fit for them,
 * scored with the same engine a sponsor's own search uses.
 */
export const sponsorLeads: Persona[] = [
  {
    id: 'tallinn-retail',
    label: 'Tallinn sports retailer',
    blurb: '€2k–10k · 18–34 · Tallinn · wants visibility',
    answers: {
      budgetBand: budgetBands[1],
      budget: budgetBands[1].midpoint,
      country: 'EE',
      demographic: '18-34',
      region: 'Tallinn',
      wants: 'visibility',
      priority: 'value-for-money',
    },
  },
  {
    id: 'tartu-gym',
    label: 'Tartu gym chain',
    blurb: '€500–2k · youth · Tartu · wants visibility',
    answers: {
      budgetBand: budgetBands[0],
      budget: budgetBands[0].midpoint,
      country: 'EE',
      demographic: 'youth',
      region: 'Tartu',
      wants: 'visibility',
      priority: 'local-story',
    },
  },
  {
    id: 'ee-bank',
    label: 'Estonian bank',
    blurb: '€10k–50k · 18–34 · national · wants content',
    answers: {
      budgetBand: budgetBands[2],
      budget: budgetBands[2].midpoint,
      country: 'EE',
      demographic: '18-34',
      region: 'National',
      wants: 'content',
      priority: 'corroborated-audience',
    },
  },
  {
    id: 'ee-family-insurer',
    label: 'Estonian family insurer',
    blurb: '€2k–10k · families · national · wants hospitality',
    answers: {
      budgetBand: budgetBands[1],
      budget: budgetBands[1].midpoint,
      country: 'EE',
      demographic: 'families',
      region: 'National',
      wants: 'hospitality',
      priority: 'value-for-money',
    },
  },
  {
    id: 'parnu-hospitality',
    label: 'Pärnu hospitality group',
    blurb: '€500–2k · families · Pärnu · wants naming',
    answers: {
      budgetBand: budgetBands[0],
      budget: budgetBands[0].midpoint,
      country: 'EE',
      demographic: 'families',
      region: 'Pärnu',
      wants: 'naming',
      priority: 'local-story',
    },
  },
  {
    id: 'narva-industrial',
    label: 'Narva industrial employer',
    blurb: '€2k–10k · 35–54 · Narva · wants visibility',
    answers: {
      budgetBand: budgetBands[1],
      budget: budgetBands[1].midpoint,
      country: 'EE',
      demographic: '35-54',
      region: 'Narva',
      wants: 'visibility',
      priority: 'local-story',
    },
  },
  {
    id: 'baltic-beverage',
    label: 'Lithuanian beverage brand',
    blurb: '€10k–50k · 18–34 · national · wants visibility',
    answers: {
      budgetBand: budgetBands[2],
      budget: budgetBands[2].midpoint,
      country: 'LT',
      demographic: '18-34',
      region: 'National',
      wants: 'visibility',
      priority: 'corroborated-audience',
    },
  },
  {
    id: 'vilnius-tech',
    label: 'Vilnius tech employer',
    blurb: '€2k–10k · 18–34 · Vilnius · wants content',
    answers: {
      budgetBand: budgetBands[1],
      budget: budgetBands[1].midpoint,
      country: 'LT',
      demographic: '18-34',
      region: 'Vilnius',
      wants: 'content',
      priority: 'value-for-money',
    },
  },
  {
    id: 'riga-bank',
    label: 'Latvian regional bank',
    blurb: '€2k–10k · families · Riga · wants naming',
    answers: {
      budgetBand: budgetBands[1],
      budget: budgetBands[1].midpoint,
      country: 'LV',
      demographic: 'families',
      region: 'Riga',
      wants: 'naming',
      priority: 'value-for-money',
    },
  },
];
