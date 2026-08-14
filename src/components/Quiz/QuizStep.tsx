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
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-ink-400">{subtitle}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={String(option.value)}
              onClick={() => onSelect(option.value)}
              className={`group rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-accent-500 bg-accent-50 ring-1 ring-accent-500'
                  : 'border-slate-200 bg-white hover:border-accent-300 hover:shadow-card'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`font-medium ${isSelected ? 'text-accent-700' : 'text-ink-900'}`}
                >
                  {option.label}
                </span>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected ? 'border-accent-500 bg-accent-500' : 'border-slate-300'
                  }`}
                >
                  {isSelected && (
                    <svg viewBox="0 0 20 20" fill="white" className="h-3 w-3">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
              </div>
              {option.hint && <p className="mt-1 text-xs text-ink-400">{option.hint}</p>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
