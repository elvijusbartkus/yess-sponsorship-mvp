import { useState } from 'react';

interface Option<T> {
  value: T;
  label: string;
  hint?: string;
}

interface QuizStepProps<T> {
  title: string;
  subtitle: string;
  options: Option<T>[];
  selected?: T;
  onSelect: (value: T) => void;
  /**
   * Adds a free-text "Other — write your own" tile below the options. The
   * fixed buckets above are what the matching engine actually understands, so
   * submitting here calls onOther with the raw text — the caller decides
   * which neutral bucket value to advance with, and shows this text back as
   * context rather than feeding it into scoring.
   */
  onOther?: (text: string) => void;
  otherPlaceholder?: string;
}

export function QuizStep<T extends string>({
  title,
  subtitle,
  options,
  selected,
  onSelect,
  onOther,
  otherPlaceholder = 'Type your own answer…',
}: QuizStepProps<T>) {
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherText, setOtherText] = useState('');

  return (
    <div className="animate-rise">
      <h2 className="display text-4xl leading-[1.05] text-ink-950 sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">{subtitle}</p>

      <div className="mt-9 grid gap-2.5 sm:grid-cols-2">
        {options.map((option, i) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={String(option.value)}
              onClick={() => onSelect(option.value)}
              className={`group relative overflow-hidden rounded-lg px-5 py-4 text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-ink-950 text-white'
                  : 'bg-white ring-1 ring-inset ring-paper-line hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink-950'
              }`}
            >
              {/* Accent edge that wipes in on hover — energy without noise. */}
              <span
                className={`absolute inset-y-0 left-0 w-1 origin-top transition-transform duration-200 ${
                  isSelected
                    ? 'scale-y-100 bg-flare-500'
                    : 'scale-y-0 bg-flare-500 group-hover:scale-y-100'
                }`}
              />

              <div className="flex items-center justify-between gap-3">
                <span
                  className={`font-display text-lg font-medium tracking-tight ${
                    isSelected ? 'text-white' : 'text-ink-950'
                  }`}
                >
                  {option.label}
                </span>
                <span
                  className={`font-display text-xs tabular-nums transition-colors ${
                    isSelected ? 'text-flare-400' : 'text-ink-200 group-hover:text-flare-500'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              {option.hint && (
                <p className={`mt-1 text-[13px] ${isSelected ? 'text-ink-300' : 'text-ink-400'}`}>
                  {option.hint}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {onOther && (
        <div className="mt-3">
          {!otherOpen ? (
            <button
              onClick={() => setOtherOpen(true)}
              className="rounded-lg border border-dashed border-paper-line px-5 py-3 text-sm font-medium text-ink-500 transition-colors hover:border-ink-950 hover:text-ink-950"
            >
              Something else — write your own
            </button>
          ) : (
            <div className="animate-rise flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-paper-line p-3">
              <input
                autoFocus
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && otherText.trim()) onOther(otherText.trim());
                }}
                placeholder={otherPlaceholder}
                className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[15px] text-ink-950 placeholder:text-ink-300 focus:outline-none"
              />
              <button
                disabled={!otherText.trim()}
                onClick={() => onOther(otherText.trim())}
                className="rounded-md bg-ink-950 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40"
              >
                Use this
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
