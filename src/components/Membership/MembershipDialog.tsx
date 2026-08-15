import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { clubPlan, firstPeriodFree, membershipPlan } from '../../data/pricing';

/** Sponsor and club membership are the same mechanic (browse/list/match free,
 * pay to unlock the next step) with different copy and pricing — one dialog,
 * parameterized by role, instead of two near-identical components. */
const COPY = {
  sponsor: {
    title: 'Contact clubs & close deals',
    description: 'Matching stays free. This is what unlocks reaching out.',
    plan: membershipPlan,
    freeMonths: firstPeriodFree.sponsorMonths,
  },
  club: {
    title: 'Unlock deal tools',
    description: "Listing and matching stay free. This is what unlocks once you're closing a deal.",
    plan: clubPlan,
    freeMonths: firstPeriodFree.clubMonths,
  },
} as const;

/**
 * Shown only at the moment it matters — pressing Contact/Propose a deal for
 * sponsors, or unlocking deal tools for clubs — never proactively. Browsing,
 * listing, and matching stay fully free; this is the one screen where either
 * side decides whether to pay to act, so the CTA gets the one accent color
 * the rest of the app spends carefully.
 */
export function MembershipDialog({
  open,
  onOpenChange,
  onStart,
  role = 'sponsor',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: () => void;
  role?: 'sponsor' | 'club';
}) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const { title, description, plan, freeMonths } = COPY[role];
  const price = billing === 'monthly' ? plan.priceMonthly : plan.priceAnnual;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-none bg-ink-950 p-6 text-white ring-hairline-dark">
        <DialogHeader>
          <p className="eyebrow text-ink-400">Membership</p>
          <DialogTitle className="display mt-1 text-2xl leading-tight text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-ink-400">{description}</DialogDescription>
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
            {plan.currency}
            {price}
          </span>
          <span className="ml-1.5 text-sm text-ink-400">/ {billing === 'monthly' ? 'mo' : 'yr'}</span>
        </p>
        <p className="mt-1.5 text-[13px] font-medium text-flare-400">
          First {freeMonths} {freeMonths === 1 ? 'month' : 'months'} free.
        </p>

        <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
          {plan.includes.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-white/80">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-flare-400" />
              {item}
            </li>
          ))}
        </ul>

        <button
          onClick={onStart}
          className="mt-6 w-full rounded-lg bg-flare-500 py-3 text-center font-display text-base font-medium text-white transition-colors hover:bg-flare-400"
        >
          Start membership
        </button>
      </DialogContent>
    </Dialog>
  );
}
