import { useEffect, useState } from 'react';
import { Camera, Check, Copy, Phone, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../common/Button';
import { draftCampaign } from '../../lib/api';
import { templateCampaignSponsorVoice } from '../../lib/campaignTemplate';
import type { Campaign } from '../../lib/campaignTemplate';
import type { Match } from '../../lib/types';

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
 * The proof, made visible: shows the platform actually producing the launch
 * kit rather than describing it. Reached from the deliverables tracker once a
 * deal is signed — this page is the answer to "aren't you just a directory."
 */
export function CampaignPage({
  match,
  sponsorName,
  onBack,
  onContinue,
}: {
  match: Match;
  sponsorName: string;
  onBack: () => void;
  onContinue: () => void;
}) {
  const { profile } = match;
  const [drafting, setDrafting] = useState(true);
  const [clubCampaign, setClubCampaign] = useState<Campaign | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [voice, setVoice] = useState<Voice>('club');
  const [managedDialogOpen, setManagedDialogOpen] = useState(false);

  const sponsorCampaign = templateCampaignSponsorVoice(sponsorName, profile);

  function load() {
    setRegenerating(true);
    draftCampaign(sponsorName, profile.id)
      .then(({ campaign }) => setClubCampaign(campaign))
      .catch(() => setClubCampaign(null))
      .finally(() => setRegenerating(false));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
      setDrafting(false);
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = voice === 'club' ? clubCampaign : sponsorCampaign;
  const firstName = profile.name.split(' ')[0];

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <Button variant="ghost" onClick={onBack}>
        ← Back
      </Button>

      <div className="mt-6 animate-rise">
        <p className="eyebrow text-flare-600">Campaign</p>
        <h1 className="display mt-3 text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[0.98] text-ink-950">
          {sponsorName} × {profile.name}
          <br />
          <span className="text-flare-500">launch kit.</span>
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
          Generated for this deal. Clubs are training, not marketing, so we do it.
        </p>
      </div>

      {drafting ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
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

          {/* A suggestion, not a mockup: what to shoot, in plain words. */}
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
              text={active?.post ?? 'Could not draft. Try regenerate.'}
              onRegenerate={load}
              regenerating={voice === 'club' && regenerating}
            />
            <CopyBlock
              label="Story copy"
              text={active?.story ?? ''}
              onRegenerate={load}
              regenerating={voice === 'club' && regenerating}
            />
          </div>

          <section className="mt-9 rounded-xl bg-white p-5 ring-1 ring-inset ring-paper-line">
            <p className="eyebrow text-ink-400">Included, free</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-700">
              This post and story are generated for every signed deal, instantly, at no cost.
            </p>
          </section>

          <section className="mt-4 rounded-xl bg-ink-950 p-5 ring-hairline-dark">
            <p className="eyebrow text-flare-400">Managed delivery, paid</p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/80">
              Want someone making sure it actually gets posted, and the deal renews? A rep checks
              in monthly (Standard) or weekly (Premium), priced per deal.
            </p>
            <button
              onClick={() => setManagedDialogOpen(true)}
              className="mt-4 font-display text-sm font-medium text-flare-400 hover:text-flare-300"
            >
              Add managed delivery →
            </button>
          </section>

          <div className="mt-8 border-t border-paper-line pt-8">
            <Button size="lg" onClick={onContinue}>
              Continue to deliverables tracker →
            </Button>
          </div>
        </>
      )}

      <ManagedDeliveryDialog open={managedDialogOpen} onOpenChange={setManagedDialogOpen} />
    </div>
  );
}
