import { useState } from 'react';
import { FileCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import type { Match, ContractRecord } from '../../lib/types';

/**
 * A demo-grade signature, not a legal one — said plainly on the screen. This
 * is the actual line between "proposed" and "real": nothing downstream
 * (deliverables tracking, campaign drafting) unlocks until both names are on
 * this agreement.
 */
export function ContractSign({
  match,
  sponsorName,
  dealValue,
  onBack,
  onSigned,
}: {
  match: Match;
  sponsorName: string;
  dealValue: number;
  onBack: () => void;
  onSigned: (record: ContractRecord) => void;
}) {
  const { profile } = match;
  const [sponsorSignatory, setSponsorSignatory] = useState(sponsorName);
  const [clubSignatory, setClubSignatory] = useState('');
  const [agreed, setAgreed] = useState(false);

  const ready = sponsorSignatory.trim().length > 1 && clubSignatory.trim().length > 1 && agreed;

  function sign() {
    if (!ready) return;
    onSigned({
      dealValue,
      sponsorSignatory: sponsorSignatory.trim(),
      clubSignatory: clubSignatory.trim(),
      signedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <Button variant="ghost" onClick={onBack}>
        ← Back
      </Button>

      <div className="mt-6 animate-rise">
        <p className="eyebrow text-flare-600">Sponsorship agreement</p>
        <h1 className="display mt-3 text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.02] text-ink-950">
          Sign to make it real.
        </h1>
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 ring-1 ring-inset ring-paper-line sm:p-7">
        <p className="eyebrow text-ink-400">Terms</p>
        <dl className="mt-3 space-y-2.5 text-[15px] text-ink-700">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Sponsor</dt>
            <dd className="font-medium text-ink-950">{sponsorName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Club / athlete</dt>
            <dd className="font-medium text-ink-950">{profile.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Sponsorship value</dt>
            <dd className="font-medium text-ink-950">{formatEur(dealValue)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Activation</dt>
            <dd className="text-right font-medium text-ink-950">{profile.activation.join(', ')}</dd>
          </div>
        </dl>
        <p className="mt-4 border-t border-paper-line pt-4 text-xs text-ink-400">
          This is a demo signature for the marketplace flow, not a legally binding contract. A real
          deployment would generate a downloadable agreement and route it through a proper
          e-signature provider.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <label className="block">
          <span className="eyebrow text-ink-400">Sponsor signatory</span>
          <input
            value={sponsorSignatory}
            onChange={(e) => setSponsorSignatory(e.target.value)}
            placeholder="Full name"
            className="mt-2 w-full rounded-lg bg-white px-5 py-3.5 font-display text-lg text-ink-950 ring-1 ring-inset ring-paper-line placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-flare-500"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink-400">{profile.name} signatory</span>
          <input
            value={clubSignatory}
            onChange={(e) => setClubSignatory(e.target.value)}
            placeholder="Full name"
            className="mt-2 w-full rounded-lg bg-white px-5 py-3.5 font-display text-lg text-ink-950 ring-1 ring-inset ring-paper-line placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-flare-500"
          />
        </label>

        <label className="flex items-start gap-2.5 pt-1 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded-sm border-paper-line accent-flare-500"
          />
          Both sides confirm these terms.
        </label>
      </div>

      <div className="mt-8 border-t border-paper-line pt-8">
        <Button size="lg" disabled={!ready} onClick={sign}>
          <FileCheck className="h-4 w-4" />
          Sign agreement
        </Button>
      </div>
    </div>
  );
}
