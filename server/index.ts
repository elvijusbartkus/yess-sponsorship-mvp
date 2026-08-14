import express from 'express';
import { countProfiles, getProfile, insertProfile, listProfiles, seed, updateProfile } from './db';
import { addModelReasons, llmEnabled } from './reasoning';
import { applyEnrichment, corroborateFromPublicSources } from './enrich';
import { draftCampaign } from './campaign';
import { matchSponsorToProfiles } from '../src/lib/matching';
import { profileFromDraft } from '../src/lib/draftToProfile';
import type { ProfileDraft, SponsorAnswers } from '../src/lib/types';

const app = express();
app.use(express.json({ limit: '256kb' }));

const PORT = Number(process.env.PORT ?? 8787);

seed();
console.log(`[db] ${countProfiles()} profiles in the database`);
console.log(`[llm] match reasoning ${llmEnabled() ? 'enabled' : 'disabled (template reasons)'}`);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, profiles: countProfiles(), llm: llmEnabled() });
});

app.get('/api/profiles', (_req, res) => {
  res.json({ profiles: listProfiles() });
});

app.get('/api/profiles/:id', (req, res) => {
  const profile = getProfile(req.params.id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json({ profile });
});

/**
 * Ranking is deterministic and computed here, on the server, from the database.
 * The model is only invited afterwards to rewrite the explanation text.
 */
app.post('/api/match', async (req, res) => {
  const answers = req.body?.answers as SponsorAnswers | undefined;
  if (!answers?.country || !answers?.budgetBand) {
    return res.status(400).json({ error: 'answers.country and answers.budgetBand are required' });
  }

  const matches = matchSponsorToProfiles(answers, listProfiles());

  try {
    const withReasons = await addModelReasons(matches, answers);
    res.json({ matches: withReasons, reasonSource: llmEnabled() ? 'model' : 'template' });
  } catch (error) {
    // Belt and braces — addModelReasons already swallows per-match failures.
    console.warn('[match] reasoning layer failed wholesale, serving templates:', error);
    res.json({ matches, reasonSource: 'template' });
  }
});

app.post('/api/profiles', (req, res) => {
  const draft = req.body?.draft as ProfileDraft | undefined;
  if (!draft?.name || !draft?.country || !draft?.dealRange) {
    return res.status(400).json({ error: 'draft.name, draft.country and draft.dealRange are required' });
  }
  const profile = profileFromDraft(draft, countProfiles());
  insertProfile(profile);
  res.status(201).json({ profile });
});

/** The curation layer — drafts the campaign copy for a sponsorship. */
app.post('/api/campaign', async (req, res) => {
  const { sponsor, profileId } = req.body ?? {};
  if (typeof sponsor !== 'string' || typeof profileId !== 'string') {
    return res.status(400).json({ error: 'sponsor and profileId are required' });
  }
  const profile = getProfile(profileId);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  res.json({ campaign: await draftCampaign(sponsor, profile) });
});

/** Optional: prove the corroboration story with a real public lookup. */
app.post('/api/profiles/:id/enrich', async (req, res) => {
  const profile = getProfile(req.params.id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const result = await corroborateFromPublicSources(profile, controller.signal);
    const updated = applyEnrichment(profile, result);
    if (updated !== profile) updateProfile(updated);
    res.json({ result, profile: updated });
  } finally {
    clearTimeout(timer);
  }
});

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});
