import { useEffect, useState } from 'react';

// Short on purpose: this sits inside a ~60 second demo, so a long spinner is
// dead air. Two beats is enough to read as real computation.
const LINE_MS = 850;

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
    <div className="flex flex-1 items-center justify-center px-5 py-20">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto h-20 w-20">
          <svg viewBox="0 0 80 80" className="h-full w-full animate-spin [animation-duration:1.1s]">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              strokeWidth="5"
              className="stroke-paper-line"
            />
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
        </div>

        <p className="eyebrow mt-10 text-flare-600">Matching</p>

        {/* Keyed so each line animates in rather than swapping abruptly. */}
        <p
          key={line}
          className="display animate-rise mt-3 text-2xl leading-tight text-ink-950 sm:text-3xl"
        >
          {lines[line]}
        </p>
      </div>
    </div>
  );
}
