import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '../common/Button';
import { countryOptions } from '../../data/sponsorQuiz';
import { launchPromo, membershipPlan } from '../../data/pricing';
import type { Country, SponsorAccount } from '../../lib/types';

/**
 * Account and membership in one screen, not two. Splitting them added a full
 * page for no real reason — the sponsor is going to see the price either way,
 * so showing it alongside the fields they're already filling in is one fewer
 * step, not one fewer piece of information.
 */
export function SponsorSignup({
  onComplete,
  onCancel,
}: {
  onComplete: (account: SponsorAccount) => void;
  onCancel: () => void;
}) {
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState<Country | null>(null);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const ready = company.trim().length > 1 && /.+@.+\..+/.test(email) && country !== null;

  function submit() {
    if (!ready || !country) return;
    onComplete({
      company: company.trim(),
      email: email.trim(),
      country,
      membershipActive: true,
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-14">
        <div className="w-full animate-rise">
          <p className="eyebrow text-flare-600">Create your sponsor account</p>
          <h1 className="display mt-3 text-4xl leading-[1.05] text-ink-950 sm:text-5xl">
            Unlock matching.
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
            Three fields and a membership — then straight into what you want out of a sponsorship.
          </p>

          <div className="mt-9 space-y-3">
            <label className="block">
              <span className="eyebrow text-ink-400">Company</span>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Tartu Fitness OÜ"
                className="mt-2 w-full rounded-lg bg-white px-5 py-4 font-display text-xl text-ink-950 ring-1 ring-inset ring-paper-line placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-flare-500"
              />
            </label>

            <label className="block">
              <span className="eyebrow text-ink-400">Work email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.ee"
                className="mt-2 w-full rounded-lg bg-white px-5 py-4 font-display text-xl text-ink-950 ring-1 ring-inset ring-paper-line placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-flare-500"
              />
            </label>

            <div>
              <span className="eyebrow text-ink-400">Where you operate</span>
              <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
                {countryOptions.map((option) => {
                  const active = country === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setCountry(option.value)}
                      className={`rounded-lg px-5 py-4 text-left font-display text-lg font-medium transition-all duration-200 ${
                        active
                          ? 'bg-ink-950 text-white'
                          : 'bg-white text-ink-950 ring-1 ring-inset ring-paper-line hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink-950'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-lg bg-ink-950 text-white">
            <div className="flare-rule h-2" />
            <div className="p-6 sm:p-7">
              {launchPromo.active && (
                <p className="eyebrow inline-block rounded-md bg-flare-500 px-2.5 py-1 text-white">
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
              {launchPromo.active && (
                <p className="mt-1 text-sm text-ink-300">
                  then {membershipPlan.currency}
                  {billing === 'monthly' ? membershipPlan.priceMonthly : membershipPlan.priceAnnual}{' '}
                  after your free period, plus {(launchPromo.commissionRate * 100).toFixed(0)}%
                  commission on closed deals during launch.
                </p>
              )}

              <ul className="mt-5 space-y-2">
                {membershipPlan.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-flare-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
            <span className="font-medium text-ink-950">Browsing the public list is free</span> for
            anyone. This membership is what runs the matching engine and lets you contact who you
            match with — clubs and athletes have their own membership on their side of the table.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" disabled={!ready} onClick={submit}>
              Start membership →
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              ← Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
