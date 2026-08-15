import { useEffect, useState } from 'react';
import { Camera, Check, CheckCircle2, Circle, Copy, Phone, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import { draftCampaign } from '../../lib/api';
import { templateCampaignSponsorVoice } from '../../lib/campaignTemplate';
import type { Campaign } from '../../lib/campaignTemplate';
import type { ContractRecord, Deliverable, Match } from '../../lib/types';

type Voice = 'club' | 'sponsor';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          })
          .catch(() => {});
      }}
      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-400 transition-colors hover:text-ink-950"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-gain-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function RegenerateButton({ onClick, busy }: { onClick: () => void; busy: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-400 transition-colors hover:text-ink-950 disabled:opacity-50"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${busy ? 'animate-spin' : ''}`} />
      Regenerate
    </button>
  );
}

/** A plain text block for one piece of generated copy — no fake social-media
 * chrome (avatars, like icons), since this is a suggestion, not a mockup of
 * a real post. */
function CopyBlock({
  label,
  text,
  onRegenerate,
  regenerating,
}: {
  label: string;
  text: string;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  return (
    <div className="rounded-lg bg-white p-4 ring-1 ring-inset ring-paper-line">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <div className="flex items-center gap-3">
          <RegenerateButton onClick={onRegenerate} busy={regenerating} />
          <CopyButton text={text} />
        </div>
      </div>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-800">{text}</p>
    </div>
  );
}

/**
 * The auto-generated content (Layer 1) is free and universal — it's the
 * anti-leakage mechanism, never gated. Managed delivery (Layer 2) is the
 * paid, human-bound service line that drives renewals. This dialog is
 * deliberately an info panel, not a checkout — there's no real payment flow
 * for a demo, and no invented price: the honest answer is "priced per deal,
 * talk to us."
 */
function ManagedDeliveryDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-none bg-ink-950 p-6 text-white ring-hairline-dark">
        <DialogHeader>
          <p className="eyebrow text-flare-400">Managed delivery</p>
          <DialogTitle className="display mt-1 text-2xl leading-tight text-white">
            A rep makes sure it happens.
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-white/70">
            The free content is generated instantly. This is the human layer that keeps a
            sponsorship on track once it's live, on top of the same 2% commission, not instead
            of it.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2.5">
          <div className="rounded-lg bg-white/5 p-3.5">
            <p className="text-[13px] font-medium text-white">Standard</p>
            <p className="mt-1 text-[12px] leading-relaxed text-white/70">
              Monthly check-in, keeps the campaign on track. For most deals.
            </p>
          </div>
          <div className="rounded-lg bg-white/5 p-3.5">
            <p className="text-[13px] font-medium text-white">Premium</p>
            <p className="mt-1 text-[12px] leading-relaxed text-white/70">
              Weekly call with a dedicated rep. Full hands-on delivery and renewal support, for
              bigger deals.
            </p>
          </div>
        </div>

        <p className="mt-4 text-[12px] text-white/60">
          Priced per deal. Talk to us before your first renewal.
        </p>

        <button
          onClick={() => onOpenChange(false)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-flare-500 py-3 text-center font-display text-base font-medium text-white transition-colors hover:bg-flare-400"
        >
          <Phone className="h-4 w-4" />
          Get in touch
        </button>
      </DialogContent>
    </Dialog>
  );
}

/**
 * One page, not two: the launch kit (the answer to "aren't you just a
 * directory") and the deliverables record live together here, so a sponsor
 * never has to navigate away from proof-of-work to see it or to log it.
 */
export function DeliverablesTracker({
  match,
  contract,
  sponsorName,
  onBack,
  onHome,
}: {
  match: Match;
  contract: ContractRecord;
  sponsorName: string;
  onBack: () => void;
  onHome: () => void;
}) {
  const { profile } = match;
  const [items, setItems] = useState<Deliverable[]>(() =>
    profile.activation.map((label, i) => ({ id: `d${i}`, label, done: false })),
  );

  const [drafting, setDrafting] = useState(true);
  const [clubCampaign, setClubCampaign] = useState<Campaign | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [voice, setVoice] = useState<Voice>('club');
  const [managedDialogOpen, setManagedDialogOpen] = useState(false);

  const sponsorCampaign = templateCampaignSponsorVoice(sponsorName, profile);

  function loadCampaign() {
    setRegenerating(true);
    draftCampaign(sponsorName, profile.id)
      .then(({ campaign }) => setClubCampaign(campaign))
      .catch(() => setClubCampaign(null))
      .finally(() => setRegenerating(false));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCampaign();
      setDrafting(false);
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCampaign = voice === 'club' ? clubCampaign : sponsorCampaign;
  const firstName = profile.name.split(' ')[0];

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
    <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <Button variant="ghost" onClick={onBack}>
        ← Back
      </Button>

      <div className="mt-6 animate-rise">
        <p className="eyebrow text-gain-700">Signed · {formatEur(contract.dealValue)}</p>
        <h1 className="display mt-3 text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.02] text-ink-950">
          {sponsorName} × {profile.name}
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
          The launch kit generated for this deal, and the record of what actually posted, the
          proof you show internally to justify the spend, still here at renewal time.
        </p>
      </div>

      {/* LAUNCH KIT — generated content, shown inline, not a separate screen. */}
      {drafting ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl bg-white py-16 text-center ring-1 ring-inset ring-paper-line">
          <RefreshCw className="h-5 w-5 animate-spin text-flare-500" />
          <p className="text-sm text-ink-400">Drafting your campaign…</p>
        </div>
      ) : (
        <>
          <div className="mt-8 inline-flex items-center gap-1 rounded-md bg-paper-dim p-1">
            {(['club', 'sponsor'] as Voice[]).map((v) => (
              <button
                key={v}
                onClick={() => setVoice(v)}
                className={`rounded-sm px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  voice === v ? 'bg-white text-ink-950 shadow-card' : 'text-ink-500 hover:text-ink-950'
                }`}
              >
                {v === 'club' ? `${firstName} voice` : `${sponsorName} voice`}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-lg bg-paper-dim p-4">
            <Camera className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                What to photograph
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-700">{profile.imageHint}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <CopyBlock
              label="Post copy"
              text={activeCampaign?.post ?? 'Could not draft. Try regenerate.'}
              onRegenerate={loadCampaign}
              regenerating={voice === 'club' && regenerating}
            />
            <CopyBlock
              label="Story copy"
              text={activeCampaign?.story ?? ''}
              onRegenerate={loadCampaign}
              regenerating={voice === 'club' && regenerating}
            />
          </div>

          <section className="mt-9 rounded-xl bg-white p-5 ring-1 ring-inset ring-paper-line">
            <p className="eyebrow text-ink-400">Included, free</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-700">
              This post and story are generated for every signed deal, instantly, at no cost.
            </p>
          </section>

          <section className="mt-4 overflow-hidden rounded-xl bg-ink-950 p-6 ring-1 ring-inset ring-flare-500/30 sm:p-7">
            <p className="eyebrow text-flare-400">Managed delivery, paid</p>
            <h3 className="display mt-2 text-2xl leading-tight text-white sm:text-3xl">
              Make sure it actually delivers.
            </h3>
            <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-white/80">
              A rep checks in monthly (Standard) or weekly (Premium) so the campaign stays on
              track and the deal renews. Priced per deal.
            </p>
            <button
              onClick={() => setManagedDialogOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-flare-500 px-5 py-2.5 font-display text-sm font-medium text-white transition-colors hover:bg-flare-400"
            >
              Add managed delivery →
            </button>
          </section>
        </>
      )}

      {/* DELIVERABLES — the tracked checklist, same page, right below the kit. */}
      <section className="mt-9 rounded-lg bg-white p-6 ring-1 ring-inset ring-paper-line sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="eyebrow text-ink-400">Deliverables</p>
          <p className="text-sm font-medium text-ink-950">
            {doneCount} / {items.length} delivered
          </p>
        </div>

        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-md border border-paper-line px-4 py-3.5">
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

      <ManagedDeliveryDialog open={managedDialogOpen} onOpenChange={setManagedDialogOpen} />
    </div>
  );
}
