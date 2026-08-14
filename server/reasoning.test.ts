import { afterEach, describe, expect, it, vi } from 'vitest';
import { addModelReasons, llmEnabled } from './reasoning';
import { matchSponsorToProfiles } from '../src/lib/matching';
import { profiles } from '../src/data/profiles';
import { personas } from '../src/data/personas';

const answers = personas[0].answers;
const templateMatches = () => matchSponsorToProfiles(answers, profiles);

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('LLM reasoning is optional, never load-bearing', () => {
  it('is disabled without an API key, whatever the flag says', () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '');
    vi.stubEnv('USE_LLM_REASONS', 'true');
    expect(llmEnabled()).toBe(false);
  });

  it('can be switched off even when a key is present', () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test');
    vi.stubEnv('USE_LLM_REASONS', 'false');
    expect(llmEnabled()).toBe(false);
  });

  it('returns the template reasons untouched when disabled', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '');
    const before = templateMatches();
    const after = await addModelReasons(before, answers);
    expect(after).toEqual(before);
    expect(after.every((m) => m.reasons.length > 0)).toBe(true);
  });

  it('falls back to template reasons when the model call throws', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test');
    vi.stubEnv('USE_LLM_REASONS', 'true');
    // Any failure inside the call path — network, timeout, bad JSON, refusal.
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const before = templateMatches();
    const after = await addModelReasons(before, answers);

    expect(after).toHaveLength(before.length);
    after.forEach((match, i) => {
      expect(match.reasons).toEqual(before[i].reasons);
      expect(match.reasonsFromModel).toBe(false);
      // Ranking and scores are computed before the model is ever consulted.
      expect(match.score).toBe(before[i].score);
      expect(match.profile.id).toBe(before[i].profile.id);
    });
  });

  it('preserves deterministic ranking order regardless of the reasoning layer', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '');
    const before = templateMatches();
    const after = await addModelReasons(before, answers);
    expect(after.map((m) => m.profile.id)).toEqual(before.map((m) => m.profile.id));
  });
});
