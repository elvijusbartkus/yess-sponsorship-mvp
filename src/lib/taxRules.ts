import type { MatchTaxBenefit, Profile } from './types';

export const TAX_CAVEAT =
  'Indicative only — subject to recipient status and statutory caps. Confirm with your accountant.';

export function formatEur(amount: number): string {
  return `€${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * A supporting benefit, not the product. One restrained line per match.
 *
 * Rates as of 2025: Lithuanian corporate income tax 16%, Estonian distribution
 * tax 22%. Where there is no qualifying status there is no saving, and the UI
 * must show none — a faked euro figure on a non-qualifying profile is the
 * fastest way to lose a room of sponsors.
 */
export function computeTaxBenefit(budget: number, profile: Profile): MatchTaxBenefit {
  const benefit = profile.taxStatus.benefit;

  switch (benefit.kind) {
    case 'multiplier': {
      const deduction = budget * benefit.factor;
      const taxSaved = deduction * benefit.corporateTaxRate;
      return {
        applies: true,
        tag: 'Enhanced tax relief available',
        line: 'Holds support-recipient status, so this sponsorship can qualify for enhanced tax relief on top of the usual deduction. Exact savings depend on your accountant\'s numbers.',
        deduction,
        taxSaved,
        realCost: budget - taxSaved,
        caveat: TAX_CAVEAT,
      };
    }

    case 'allowance': {
      const taxSaved = budget * benefit.corporateTaxRate;
      return {
        applies: true,
        tag: 'Tax-free allowance available',
        line: 'Registered recipient, so this sponsorship can fall under the tax-free allowance rather than being taxed as a distribution. Exact savings depend on your accountant\'s numbers.',
        deduction: budget,
        taxSaved,
        realCost: budget - taxSaved,
        caveat: TAX_CAVEAT,
      };
    }

    case 'none':
    default:
      return {
        applies: false,
        tag: 'Standard marketing spend',
        line: 'No enhanced relief applies here — this is deductible as ordinary marketing spend.',
        deduction: budget,
        taxSaved: 0,
        realCost: budget,
        caveat: TAX_CAVEAT,
      };
  }
}
