import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profiles } from '../../data/profiles';
import { COUNTRY_LABEL } from '../../lib/matching';

const ADVANCE_MS = 2800;

/**
 * The hero's opening thesis, made concrete instead of asserted: real
 * audiences, on the platform right now, that have never had a price on
 * them. A stadium scoreboard is the one visual object every one of these
 * clubs already has in its own world — so the ticker borrows that object's
 * language (tabular digits, a dark board, a flip between rows) rather than
 * a generic stat card with a gradient.
 */
export function ScoreboardTicker() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % profiles.length), ADVANCE_MS);
    return () => clearInterval(t);
  }, [paused]);

  const profile = profiles[index];

  return (
    <div
      className="mt-6 flex items-stretch overflow-hidden rounded-md bg-ink-950 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-1.5 border-r border-white/10 px-3 py-2.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flare-500 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flare-500" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400">
          On the board
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden px-4 py-2.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5"
          >
            <span className="font-display text-[15px] font-medium text-white">{profile.name}</span>
            <span className="text-[12px] text-ink-400">
              {profile.region}, {COUNTRY_LABEL[profile.country]}
            </span>
            <span className="ml-auto font-display text-[15px] tabular-nums text-flare-400 sm:ml-0">
              {profile.audienceSize.toLocaleString('en-US')} reached
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
