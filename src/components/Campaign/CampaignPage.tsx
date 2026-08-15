import { useEffect, useState } from 'react';
import { Check, Copy, Heart, MessageCircle, RefreshCw, Send } from 'lucide-react';
import { Button } from '../common/Button';
import { draftCampaign } from '../../lib/api';
import { templateCampaignSponsorVoice } from '../../lib/campaignTemplate';
import type { Campaign } from '../../lib/campaignTemplate';
import type { Match } from '../../lib/types';

type Voice = 'club' | 'sponsor';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

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

/** Looks like a real social post — avatar, image area, copy, action icons — not a paragraph. */
function SocialPostCard({
  name,
  handle,
  imageHint,
  post,
  onRegenerate,
  regenerating,
}: {
  name: string;
  handle: string;
  imageHint: string;
  post: string;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-inset ring-paper-line">
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-flare-500 text-sm font-semibold text-white">
          {initials(name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-medium text-ink-950">{name}</p>
          <p className="truncate text-[12px] text-ink-400">{handle}</p>
        </div>
      </div>

      <div className="flex aspect-[4/3] items-center justify-center bg-paper-dim px-6 text-center">
        <p className="text-[12px] leading-relaxed text-ink-300">{imageHint}</p>
      </div>

      <div className="p-4">
        <p className="text-[14px] leading-relaxed text-ink-800">{post}</p>
      </div>

      <div className="flex items-center justify-between border-t border-paper-line px-4 py-3">
        <div className="flex items-center gap-4 text-ink-300">
          <Heart className="h-[18px] w-[18px]" />
          <MessageCircle className="h-[18px] w-[18px]" />
          <Send className="h-[18px] w-[18px]" />
        </div>
        <div className="flex items-center gap-4">
          <RegenerateButton onClick={onRegenerate} busy={regenerating} />
          <CopyButton text={post} />
        </div>
      </div>
    </div>
  );
}

/** A vertical story frame with the caption overlaid, like a real Instagram/LinkedIn story. */
function StoryFrame({
  story,
  tag,
  onRegenerate,
  regenerating,
}: {
  story: string;
  tag: string;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  return (
    <div className="flex flex-col">
      <p className="mb-2.5 text-[11px] font-medium uppercase tracking-wide text-ink-400">Story</p>
      <div className="relative aspect-[9/16] w-full max-w-[220px] overflow-hidden rounded-xl bg-gradient-to-br from-ink-950 via-ink-900 to-flare-700 ring-hairline-dark">
        <p className="absolute left-4 top-4 text-[11px] font-medium uppercase tracking-wide text-white/60">
          {tag}
        </p>
        <p className="absolute inset-x-4 bottom-5 font-display text-lg font-medium leading-snug text-white">
          {story}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <RegenerateButton onClick={onRegenerate} busy={regenerating} />
        <CopyButton text={story} />
      </div>
    </div>
  );
}

function ChecklistRow({ label, state }: { label: string; state: 'done' | 'roadmap' }) {
  const done = state === 'done';
  return (
    <li
      className={`flex items-center justify-between rounded-md border border-paper-line px-4 py-3 ${
        done ? '' : 'opacity-50'
      }`}
    >
      <span className={`text-[14px] ${done ? 'text-ink-950' : 'text-ink-400'}`}>{label}</span>
      <span
        className={`text-[11px] font-medium uppercase tracking-wide ${
          done ? 'text-gain-600' : 'text-ink-400'
        }`}
      >
        {done ? 'Generated ✓' : 'Roadmap'}
      </span>
    </li>
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

          <div className="mt-5 grid gap-6 sm:grid-cols-[1.4fr_1fr]">
            <SocialPostCard
              name={voice === 'club' ? profile.name : sponsorName}
              handle={voice === 'club' ? `${profile.sport} · ${profile.region}` : 'Sponsor'}
              imageHint={profile.imageHint}
              post={active?.post ?? 'Could not draft. Try regenerate.'}
              onRegenerate={load}
              regenerating={voice === 'club' && regenerating}
            />
            <StoryFrame
              story={active?.story ?? ''}
              tag={`${sponsorName} × ${profile.name}`}
              onRegenerate={load}
              regenerating={voice === 'club' && regenerating}
            />
          </div>

          <p className="mt-3 text-[12px] text-ink-400">
            {clubCampaign?.fromModel
              ? 'Drafted just now for this sponsorship.'
              : 'Drafted from a template. Connect a model key for live copy.'}
          </p>

          <section className="mt-9 rounded-xl bg-white p-5 ring-1 ring-inset ring-paper-line">
            <p className="eyebrow text-ink-400">Deliverables</p>
            <ul className="mt-3 space-y-2">
              <ChecklistRow label="Launch post" state="done" />
              <ChecklistRow label="Story caption" state="done" />
              <ChecklistRow label="Reach tracking" state="roadmap" />
              <ChecklistRow label="Renewal report" state="roadmap" />
            </ul>
          </section>

          <div className="mt-8 border-t border-paper-line pt-8">
            <Button size="lg" onClick={onContinue}>
              Continue to deliverables tracker →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
