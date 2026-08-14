import { useEffect, useState } from 'react';

const LINES = [
  'Scanning Baltic clubs and athletes…',
  'Matching to your audience, region and budget…',
  'Calculating your tax position…',
];

const LINE_MS = 600;
const TOTAL_MS = 1800;

export function MatchingScreen({ onDone }: { onDone: () => void }) {
  const [line, setLine] = useState(0);

  useEffect(() => {
    const ticks = LINES.map((_, i) =>
      i === 0 ? null : setTimeout(() => setLine(i), i * LINE_MS),
    );
    const finish = setTimeout(onDone, TOTAL_MS);
    return () => {
      ticks.forEach((t) => t && clearTimeout(t));
      clearTimeout(finish);
    };
  }, [onDone]);

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-20">
      <div className="w-full max-w-md text-center">
        {/* Accent arc sweeping over a quiet track. */}
        <div className="mx-auto h-16 w-16">
          <svg viewBox="0 0 64 64" className="h-full w-full animate-spin [animation-duration:1s]">
            <circle
              cx="32"
              cy="32"
              r="27"
              fill="none"
              strokeWidth="5"
              className="stroke-paper-line"
            />
            <circle
              cx="32"
              cy="32"
              r="27"
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="42 128"
              className="stroke-flare-500"
            />
          </svg>
        </div>

        <p className="eyebrow mt-8 text-flare-600">Matching</p>

        <p
          key={line}
          className="display animate-rise mt-3 text-2xl leading-tight text-ink-950 sm:text-3xl"
        >
          {LINES[line]}
        </p>

        <div className="mt-8 flex justify-center gap-1.5">
          {LINES.map((_, i) => (
            <span
              key={i}
              className={`h-1 w-10 rounded-full transition-colors duration-300 ${
                i <= line ? 'bg-flare-500' : 'bg-paper-line'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
