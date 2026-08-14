import type { Persona } from '../lib/types';
import { budgetBands } from './sponsorQuiz';

/**
 * Repeatable demo runs. Order matters: Estonia first earns the room, the
 * Baltic-wide run second shows the ceiling (the Lithuanian 200% deduction).
 */
export const personas: Persona[] = [
  {
    id: 'tartu-gym',
    label: 'Local gym, Tartu',
    blurb: '€500–2k · youth · Tartu · local presence',
    answers: {
      budgetBand: budgetBands[0],
      budget: budgetBands[0].midpoint,
      country: 'EE',
      demographic: 'youth',
      region: 'Tartu',
      goal: 'local-presence',
      priority: 'local-story',
    },
  },
  {
    id: 'ee-bank',
    label: 'Estonian bank',
    blurb: '€10k–50k · 18–34 · national · brand awareness',
    answers: {
      budgetBand: budgetBands[2],
      budget: budgetBands[2].midpoint,
      country: 'EE',
      demographic: '18-34',
      region: 'National',
      goal: 'brand-awareness',
      priority: 'verified-audience',
    },
  },
  {
    id: 'baltic-beverage',
    label: 'Lithuanian beverage brand',
    blurb: '€10k–50k · 18–34 · national · brand awareness',
    answers: {
      budgetBand: budgetBands[2],
      budget: budgetBands[2].midpoint,
      country: 'LT',
      demographic: '18-34',
      region: 'National',
      goal: 'brand-awareness',
      priority: 'verified-audience',
    },
  },
];
