import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '../common/Button';
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
 * screen where the sponsor decides whether to pay to act.
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-none bg-ink-950 p-0 text-white sm:max-w-md">
        <div className="flare-rule h-2" />
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="display text-3xl leading-tight text-white">
            Unlock this action
          </DialogTitle>
          <DialogDescription className="text-[15px] text-ink-300">
            Matching stays free. Membership is what lets you contact clubs and athletes and close
            deals.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          {launchPromo.active && (
            <p className="eyebrow mt-2 inline-block rounded-md bg-flare-500 px-2.5 py-1 text-white">
              Launch offer — first {launchPromo.sponsorFreeMonths} months free
            </p>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setBilling('monthly')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                billing === 'monthly' ? 'bg-white text-ink-950' : 'text-ink-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                billing === 'annual' ? 'bg-white text-ink-950' : 'text-ink-300'
              }`}
            >
              Yearly
            </button>
          </div>

          <p className="mt-3">
            <span className="display text-5xl leading-none tabular-nums text-white">
              {membershipPlan.currency}
              {billing === 'monthly' ? membershipPlan.priceMonthly : membershipPlan.priceAnnual}
            </span>
            <span className="ml-2 text-base text-ink-400">
              / {billing === 'monthly' ? 'month' : 'year'}
            </span>
          </p>

          <ul className="mt-5 space-y-2">
            {membershipPlan.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-flare-400" />
                {item}
              </li>
            ))}
          </ul>

          <Button size="lg" className="mt-6 w-full" onClick={onStart}>
            Start membership
          </Button>
          <p className="mt-3 text-center text-xs text-ink-400">Cancel any time.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
