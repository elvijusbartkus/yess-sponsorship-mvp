import type { MatchTaxBenefit, Profile } from './types';

export const TAX_CAVEAT = 'Subject to recipient status and statutory caps.';

export function formatEur(amount: number): string {
  return `€${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * The wedge. Computes what a sponsorship of `budget` is actually worth to the
 * sponsor's tax position, given the recipient's country and legal status.
 *
 * Lead with the big number (deduction from the taxable base), back it with the
 * real one (cash effect). A differentiator that survives a CFO doing the
 * arithmetic in their head is worth more than one that doesn't.
 */
export function computeTaxBenefit(budget: number, profile: Profile): MatchTaxBenefit {
  const benefit = profile.taxStatus.benefit;

  switch (benefit.kind) {
    case 'multiplier': {
      const deductibleAmount = budget * benefit.factor;
      const cashSaving = deductibleAmount * benefit.corporateTaxRate;
      return {
        headline: `Your ${formatEur(budget)} writes ${formatEur(deductibleAmount)} off taxable profit`,
        subline: `≈ ${formatEur(cashSaving)} lower tax bill at ${Math.round(
          benefit.corporateTaxRate * 100,
        )}% corporate income tax`,
        deductibleAmount,
        cashSaving,
        caveat: TAX_CAVEAT,
      };
    }

    case 'allowance': {
      const cashSaving = budget * benefit.corporateTaxRate;
      return {
        headline: `Fully tax-free under Estonia's donation allowance`,
        subline: `≈ ${formatEur(cashSaving)} saved vs. a taxed distribution — capacity almost no company uses`,
        deductibleAmount: budget,
        cashSaving,
        caveat: TAX_CAVEAT,
      };
    }

    case 'none':
    default:
      return {
        headline: 'Deductible as marketing spend',
        subline: 'No enhanced relief — priced as pure audience value',
        deductibleAmount: budget,
        cashSaving: 0,
        caveat: TAX_CAVEAT,
      };
  }
}
