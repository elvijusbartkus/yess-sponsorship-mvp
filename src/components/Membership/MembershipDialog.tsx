import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { launchPromo, membershipPlan } from '../../data/pricing';

/**
 * Shown only at the moment it matters — pressing Contact or Propose a deal —
 * never proactively. Browsing and matching stay fully free; this is the one
 * screen where the sponsor decides whether to pay to act, so the CTA gets
 * the one accent color the rest of the app spends carefully.
 */
export function MembershipDialog({
  open,
  onOpenChange,
  onStart,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: () => void;
}) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const price = billing === 'monthly' ? membershipPlan.priceMonthly : membershipPlan.priceAnnual;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-none bg-ink-950 p-6 text-white ring-hairline-dark">
        <DialogHeader>
          <p className="eyebrow text-ink-400">Membership</p>
          <DialogTitle className="display mt-1 text-2xl leading-tight text-white">
            Contact clubs & close deals
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-ink-400">
            Matching stays free — this is what unlocks reaching out.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 inline-flex w-fit items-center gap-1 rounded-md bg-white/5 p-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`rounded-sm px-3 py-1 text-sm font-medium transition-colors ${
              billing === 'monthly' ? 'bg-white text-ink-950' : 'text-white/70 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`rounded-sm px-3 py-1 text-sm font-medium transition-colors ${
              billing === 'annual' ? 'bg-white text-ink-950' : 'text-white/70 hover:text-white'
            }`}
          >
            Yearly
          </button>
        </div>

        <p className="mt-4">
          <span className="display text-4xl leading-none tabular-nums text-white">
            {membershipPlan.currency}
            {price}
          </span>
          <span className="ml-1.5 text-sm text-ink-400">/ {billing === 'monthly' ? 'mo' : 'yr'}</span>
        </p>
        {launchPromo.active && (
          <p className="mt-1.5 text-[13px] font-medium text-flare-400">
            First {launchPromo.sponsorFreeMonths} months free, launch offer.
          </p>
        )}

        <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
          {membershipPlan.includes.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-white/80">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-flare-400" />
              {item}
            </li>
          ))}
        </ul>

        <button
          onClick={onStart}
          className="mt-6 w-full rounded-lg bg-[radial-gradient(circle_at_30%_20%,theme(colors.flare.400),theme(colors.flare.600)_75%)] py-3 text-center font-display text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow"
        >
          Start membership
        </button>
      </DialogContent>
    </Dialog>
  );
}
