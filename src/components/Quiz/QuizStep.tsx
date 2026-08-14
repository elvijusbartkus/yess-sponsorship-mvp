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
}

export function QuizStep<T extends string>({
  title,
  subtitle,
  options,
  selected,
  onSelect,
}: QuizStepProps<T>) {
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
              className={`group relative overflow-hidden rounded-2xl px-5 py-4 text-left transition-all duration-200 ${
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
    </div>
  );
}
