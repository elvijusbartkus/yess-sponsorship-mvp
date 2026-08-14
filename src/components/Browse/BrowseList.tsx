import { useEffect, useMemo, useState } from 'react';
import { Badge, CorroboratedBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import { COUNTRY_LABEL } from '../../lib/matching';
import { fetchProfiles } from '../../lib/api';
import type { Country, Profile } from '../../lib/types';

const COUNTRY_FILTERS: { value: Country | 'all'; label: string }[] = [
  { value: 'all', label: 'All countries' },
  { value: 'EE', label: 'Estonia' },
  { value: 'LV', label: 'Latvia' },
  { value: 'LT', label: 'Lithuania' },
];

const TYPE_FILTERS: { value: 'all' | 'club' | 'athlete'; label: string }[] = [
  { value: 'all', label: 'Clubs & athletes' },
  { value: 'club', label: 'Clubs only' },
  { value: 'athlete', label: 'Athletes only' },
];

function FilterRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            value === opt.value
              ? 'bg-ink-950 text-white'
              : 'bg-white text-ink-600 ring-1 ring-inset ring-paper-line hover:ring-ink-950'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ProfileRow({ profile, onSelect }: { profile: Profile; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="w-full rounded-lg bg-white p-5 text-left ring-1 ring-inset ring-paper-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink-950"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="display text-xl leading-tight text-ink-950">{profile.name}</h3>
            <CorroboratedBadge corroborated={profile.audienceCorroborated} />
          </div>
          <p className="mt-1 text-sm text-ink-500">
            {profile.type === 'club' ? 'Club' : 'Athlete'} · {profile.sport} · {profile.region},{' '}
            {COUNTRY_LABEL[profile.country]}
          </p>
        </div>
        <div className="text-right">
          <p className="display text-2xl leading-none tabular-nums text-ink-950">
            {profile.audienceSize.toLocaleString('en-US')}
          </p>
          <p className="mt-0.5 text-xs text-ink-400">reached</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {profile.demographics.map((d) => (
          <Badge key={d}>{d}</Badge>
        ))}
        <Badge tone="muted">
          {formatEur(profile.dealRange[0])}–{formatEur(profile.dealRange[1])}
        </Badge>
      </div>
    </button>
  );
}

function ProfileDetailPanel({ profile, onBack }: { profile: Profile; onBack: () => void }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <Button variant="ghost" onClick={onBack}>
        ← Back to browsing
      </Button>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="display text-4xl leading-tight text-ink-950 sm:text-5xl">
              {profile.name}
            </h1>
            <CorroboratedBadge corroborated={profile.audienceCorroborated} />
          </div>
          <p className="mt-2.5 text-sm text-ink-500">
            {profile.type === 'club' ? 'Club' : 'Athlete'} · {profile.sport} · {profile.region},{' '}
            {COUNTRY_LABEL[profile.country]}
          </p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="eyebrow text-ink-400">About</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{profile.results}</p>
      </section>

      <section className="mt-8">
        <h2 className="eyebrow text-ink-400">Audience</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Matchday',
              value: profile.reach.matchAttendance
                ? profile.reach.matchAttendance.toLocaleString('en-US')
                : '—',
            },
            { label: 'Instagram', value: profile.reach.instagramFollowers.toLocaleString('en-US') },
            { label: 'Facebook', value: profile.reach.facebookFans.toLocaleString('en-US') },
            { label: 'Press / yr', value: String(profile.reach.pressMentions) },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-white px-4 py-4 ring-1 ring-inset ring-paper-line">
              <p className="eyebrow text-ink-400">{s.label}</p>
              <p className="display mt-1.5 text-2xl tabular-nums text-ink-950">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="eyebrow text-ink-400">What they offer</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {profile.activation.map((item) => (
            <li
              key={item}
              className="rounded-md bg-white px-4 py-3 text-sm text-ink-700 ring-1 ring-inset ring-paper-line"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white px-4 py-4 ring-1 ring-inset ring-paper-line">
          <p className="eyebrow text-ink-400">Typical deal</p>
          <p className="mt-1.5 font-display text-lg font-medium text-ink-950">
            {formatEur(profile.dealRange[0])} – {formatEur(profile.dealRange[1])}
          </p>
        </div>
        <div className="rounded-lg bg-white px-4 py-4 ring-1 ring-inset ring-paper-line">
          <p className="eyebrow text-ink-400">Current sponsors</p>
          <p className="mt-1.5 font-display text-lg font-medium text-ink-950">
            {profile.currentSponsors.length ? profile.currentSponsors.join(', ') : 'None yet'}
          </p>
        </div>
      </section>

      <p className="mt-8 text-xs text-ink-400">
        Interested in sponsoring? Businesses answer three quick questions from the landing page to
        see fit and start a membership before contacting anyone.
      </p>
    </div>
  );
}

/**
 * Read-only browsing, open to anyone — no quiz, no fit score, since there is
 * no sponsor context to score against. Just the facts every profile already
 * carries.
 */
export function BrowseList({ onBack }: { onBack: () => void }) {
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<Country | 'all'>('all');
  const [type, setType] = useState<'all' | 'club' | 'athlete'>('all');
  const [selected, setSelected] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfiles()
      .then(({ profiles: found }) => setProfiles(found))
      .catch((e: Error) => setError(e.message));
  }, []);

  const filtered = useMemo(() => {
    if (!profiles) return [];
    return profiles.filter(
      (p) => (country === 'all' || p.country === country) && (type === 'all' || p.type === type),
    );
  }, [profiles, country, type]);

  if (selected) {
    return <ProfileDetailPanel profile={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <Button variant="ghost" onClick={onBack}>
        ← Home
      </Button>

      <h1 className="display mt-6 text-4xl leading-[1.05] text-ink-950 sm:text-5xl">
        Every club and athlete on the marketplace.
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
        No quiz, no fit score — just the full list, filterable.
      </p>
      <p className="mt-3 inline-block rounded-md bg-paper-dim px-4 py-2.5 text-[13px] leading-relaxed text-ink-600">
        This directory is free for anyone to view. Personalized matching and contacting a club or
        athlete is a sponsor membership feature.
      </p>

      <div className="mt-8 space-y-3">
        <FilterRow options={COUNTRY_FILTERS} value={country} onChange={setCountry} />
        <FilterRow options={TYPE_FILTERS} value={type} onChange={setType} />
      </div>

      {error && <p className="mt-8 text-sm text-flare-700">{error}</p>}

      {!profiles && !error && <p className="mt-8 text-sm text-ink-400">Loading…</p>}

      {profiles && (
        <div className="mt-8 space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-ink-400">Nothing matches those filters.</p>
          )}
          {filtered.map((p) => (
            <ProfileRow key={p.id} profile={p} onSelect={() => setSelected(p)} />
          ))}
        </div>
      )}
    </div>
  );
}
