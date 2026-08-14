import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Slower than a bare spinner needs, on purpose — cutting straight from a
// click to a fully-formed results screen reads as fake instant computation.
// A few readable beats let it register as real work happening.
const LINE_MS = 1400;

export function MatchingScreen({
  poolSize,
  onDone,
}: {
  poolSize: number;
  onDone: () => void;
}) {
  const lines = [
    `Scanning ${poolSize} clubs and athletes…`,
    'Matching audience, region and budget…',
    'Ranking your shortlist…',
  ];

  const [line, setLine] = useState(0);

  useEffect(() => {
    const ticks = lines.map((_, i) =>
      i === 0 ? null : setTimeout(() => setLine(i), i * LINE_MS),
    );
    const finish = setTimeout(onDone, lines.length * LINE_MS);
    return () => {
      ticks.forEach((t) => t && clearTimeout(t));
      clearTimeout(finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDone, poolSize]);

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-14">
      <div className="w-full max-w-lg text-center">
        <motion.div
          className="mx-auto h-20 w-20"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
        >
          <svg viewBox="0 0 80 80" className="h-full w-full">
            <circle cx="40" cy="40" r="34" fill="none" strokeWidth="5" className="stroke-paper-line" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="52 162"
              className="stroke-flare-500"
            />
          </svg>
        </motion.div>

        <p className="eyebrow mt-8 text-flare-600">Matching</p>

        <AnimatePresence mode="wait">
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="display mt-3 text-2xl leading-tight text-ink-950 sm:text-3xl"
          >
            {lines[line]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
