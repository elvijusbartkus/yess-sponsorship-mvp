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
    blurb: 'Small budget, wants youth in one city',
    answers: {
      budgetBand: budgetBands[0],
      budget: budgetBands[0].midpoint,
      country: 'EE',
      demographic: 'youth',
      region: 'Tartu',
      goal: 'local-presence',
    },
  },
  {
    id: 'ee-bank',
    label: 'Estonian bank',
    blurb: 'National reach, 18–34, mid-six-figure marketing budget',
    answers: {
      budgetBand: budgetBands[2],
      budget: budgetBands[2].midpoint,
      country: 'EE',
      demographic: '18-34',
      region: 'National',
      goal: 'brand-awareness',
    },
  },
  {
    id: 'baltic-beverage',
    label: 'Baltic beverage brand',
    blurb: 'Lithuania-based, national reach — the 200% deduction run',
    answers: {
      budgetBand: budgetBands[2],
      budget: budgetBands[2].midpoint,
      country: 'LT',
      demographic: '18-34',
      region: 'National',
      goal: 'brand-awareness',
    },
  },
];
