import { useState } from 'react';
import { Button } from '../common/Button';
import { countryOptions } from '../../data/sponsorQuiz';
import { membershipPlan } from '../../data/pricing';
import type { Country, SponsorAccount } from '../../lib/types';

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

  const ready = company.trim().length > 1 && /.+@.+\..+/.test(email) && country !== null;

  function submit() {
    if (!ready || !country) return;
    onComplete({
      company: company.trim(),
      email: email.trim(),
      country,
      membershipActive: false,
    });
  }

  return (
    <div className="flex flex-1 flex-col">

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-14">
        <div className="w-full animate-rise">
          <p className="eyebrow text-flare-600">Step 1 of 2</p>
          <h1 className="display mt-3 text-4xl leading-[1.05] text-ink-950 sm:text-5xl">
            Create your sponsor account
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
            Three fields. Then membership, then what you want out of a sponsorship.
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

          {/* Plant the paywall early — the sponsor should never be surprised by it. */}
          <p className="mt-6 rounded-lg bg-paper-dim px-5 py-4 text-[13px] leading-relaxed text-ink-600">
            <span className="font-medium text-ink-950">Browsing the public list is free.</span>{' '}
            {membershipPlan.name} ({membershipPlan.currency}
            {membershipPlan.priceMonthly}/month) is what unlocks the matching engine — running your
            answers against real clubs and athletes, and contacting the ones you want. Clubs are
            never charged.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" disabled={!ready} onClick={submit}>
              Continue to membership →
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
