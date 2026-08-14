import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import type { ContractRecord, Deliverable, Match } from '../../lib/types';

/**
 * The half that actually stops leakage. A signed deal with no record of what
 * was delivered is just an introduction that happened once — this is the
 * tracked checklist that gives the sponsor a reason to keep the deal (and the
 * next one) on the platform: proof for their own marketing budget, one
 * dashboard instead of a dozen WhatsApp threads, and a report that's still
 * here at renewal time instead of buried in someone's DMs.
 */
export function DeliverablesTracker({
  match,
  contract,
  onBack,
  onHome,
}: {
  match: Match;
  contract: ContractRecord;
  onBack: () => void;
  onHome: () => void;
}) {
  const { profile } = match;
  const [items, setItems] = useState<Deliverable[]>(() =>
    profile.activation.map((label, i) => ({ id: `d${i}`, label, done: false })),
  );

  const doneCount = items.filter((d) => d.done).length;
  const totalReach = items.reduce((sum, d) => sum + (d.reachNumber ?? 0), 0);

  function toggle(id: string) {
    setItems((list) => list.map((d) => (d.id === id ? { ...d, done: !d.done } : d)));
  }

  function setReach(id: string, value: string) {
    const n = Number(value.replace(/[^0-9]/g, ''));
    setItems((list) => list.map((d) => (d.id === id ? { ...d, reachNumber: n || undefined } : d)));
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-9 sm:py-12">
      <Button variant="ghost" onClick={onBack}>
        ← Back
      </Button>

      <div className="mt-6 animate-rise">
        <p className="eyebrow text-gain-700">Signed · {formatEur(contract.dealValue)}</p>
        <h1 className="display mt-3 text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.02] text-ink-950">
          {profile.name} campaign tracker
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
          What was promised, what's actually posted, and the reach it got — the record you show
          internally to justify the spend, still here at renewal time.
        </p>
      </div>

      <section className="mt-8 rounded-lg bg-white p-6 ring-1 ring-inset ring-paper-line sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="eyebrow text-ink-400">Deliverables</p>
          <p className="text-sm font-medium text-ink-950">
            {doneCount} / {items.length} delivered
          </p>
        </div>

        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-md border border-paper-line px-4 py-3.5"
            >
              <button
                onClick={() => toggle(item.id)}
                className="flex w-full items-center gap-3 text-left"
              >
                {item.done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-gain-600" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-ink-300" />
                )}
                <span
                  className={`flex-1 text-[15px] ${item.done ? 'text-ink-950' : 'text-ink-600'}`}
                >
                  {item.label}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  {item.done ? 'Posted' : 'Not posted'}
                </span>
              </button>

              {item.done && (
                <div className="mt-2.5 flex items-center gap-2 pl-8">
                  <span className="text-xs text-ink-400">Reach</span>
                  <input
                    inputMode="numeric"
                    value={item.reachNumber ?? ''}
                    onChange={(e) => setReach(item.id, e.target.value)}
                    placeholder="e.g. 4200"
                    className="w-28 rounded-sm border border-paper-line bg-paper-dim px-2.5 py-1 text-sm text-ink-950 focus:outline-none focus:ring-2 focus:ring-flare-500"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>

        {totalReach > 0 && (
          <p className="mt-4 border-t border-paper-line pt-4 text-sm text-ink-600">
            <span className="font-medium text-ink-950">{totalReach.toLocaleString('en-US')}</span>{' '}
            total reach logged on this deal so far.
          </p>
        )}
      </section>

      <div className="mt-8 border-t border-paper-line pt-8">
        <Button variant="ghost" onClick={onHome}>
          Back to matches
        </Button>
      </div>
    </div>
  );
}
