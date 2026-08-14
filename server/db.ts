import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { profiles as seedProfiles } from '../src/data/profiles';
import type { Profile } from '../src/lib/types';

const DB_PATH = process.env.DATABASE_PATH ?? resolve(process.cwd(), 'data/marketplace.db');

mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

/**
 * Columns that are queried or filtered live as real columns; the rest of the
 * profile travels as JSON. A profile is a document, not a join-heavy entity —
 * splitting `reach` and `activation` into tables would buy nothing here.
 */
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id                    TEXT PRIMARY KEY,
    name                  TEXT NOT NULL,
    country               TEXT NOT NULL,
    region                TEXT NOT NULL,
    audience_size         INTEGER NOT NULL,
    audience_corroborated INTEGER NOT NULL,
    source                TEXT NOT NULL DEFAULT 'seed',
    created_at            TEXT NOT NULL,
    data                  TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);
`);

const insert = db.prepare(`
  INSERT INTO profiles (id, name, country, region, audience_size, audience_corroborated, source, created_at, data)
  VALUES (@id, @name, @country, @region, @audience_size, @audience_corroborated, @source, @created_at, @data)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    country = excluded.country,
    region = excluded.region,
    audience_size = excluded.audience_size,
    audience_corroborated = excluded.audience_corroborated,
    data = excluded.data
`);

function toRow(profile: Profile, source: string) {
  return {
    id: profile.id,
    name: profile.name,
    country: profile.country,
    region: profile.region,
    audience_size: profile.audienceSize,
    audience_corroborated: profile.audienceCorroborated ? 1 : 0,
    source,
    created_at: new Date().toISOString(),
    data: JSON.stringify(profile),
  };
}

/** Idempotent — safe to run on every boot. */
export function seed(): number {
  const run = db.transaction((rows: Profile[]) => {
    for (const p of rows) insert.run(toRow(p, 'seed'));
  });
  run(seedProfiles);
  return seedProfiles.length;
}

export function listProfiles(): Profile[] {
  const rows = db.prepare('SELECT data FROM profiles ORDER BY created_at, id').all() as {
    data: string;
  }[];
  return rows.map((r) => JSON.parse(r.data) as Profile);
}

export function getProfile(id: string): Profile | undefined {
  const row = db.prepare('SELECT data FROM profiles WHERE id = ?').get(id) as
    | { data: string }
    | undefined;
  return row ? (JSON.parse(row.data) as Profile) : undefined;
}

export function insertProfile(profile: Profile, source = 'self-listed'): Profile {
  insert.run(toRow(profile, source));
  return profile;
}

export function updateProfile(profile: Profile): Profile {
  insert.run(toRow(profile, 'seed'));
  return profile;
}

export function countProfiles(): number {
  return (db.prepare('SELECT COUNT(*) AS n FROM profiles').get() as { n: number }).n;
}
