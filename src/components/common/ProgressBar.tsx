export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="display text-5xl leading-none text-ink-950">
            {String(current + 1).padStart(2, '0')}
          </span>
          <span className="font-display text-lg font-medium text-ink-300">
            / {String(total).padStart(2, '0')}
          </span>
        </div>
        <span className="eyebrow text-ink-400">{pct}%</span>
      </div>

      {/* Segmented rather than a plain bar — reads as steps, not loading. */}
      <div className="mt-4 flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= current ? 'bg-flare-500' : 'bg-paper-line'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
