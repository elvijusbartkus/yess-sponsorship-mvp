function DoorCard({
  eyebrow,
  title,
  body,
  cta,
  onClick,
  tone,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  tone: 'ink' | 'flare';
}) {
  const ink = tone === 'ink';
  return (
    <button
      onClick={onClick}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 text-left transition-all duration-200 hover:-translate-y-1.5 sm:p-8 ${
        ink ? 'bg-ink-950 text-white hover:shadow-lift' : 'bg-flare-500 text-white hover:shadow-flare'
      }`}
    >
      <p className={`eyebrow ${ink ? 'text-flare-400' : 'text-white/70'}`}>{eyebrow}</p>

      <h2 className="display mt-3 text-3xl leading-[1.05] text-white sm:text-4xl">{title}</h2>

      <p className={`mt-2.5 flex-1 text-[15px] leading-relaxed ${ink ? 'text-ink-300' : 'text-white/80'}`}>
        {body}
      </p>

      <span className="mt-6 inline-flex items-center gap-2 font-display text-base font-medium text-white">
        {cta}
        <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
      </span>
    </button>
  );
}

export function Landing({
  onSponsorStart,
  onClubStart,
  onPricing,
}: {
  onSponsorStart: () => void;
  onClubStart: () => void;
  onPricing: () => void;
}) {
  return (
    // Sized so the headline and both doors clear the fold on a laptop.
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-10 sm:py-14">
      <div className="animate-rise max-w-3xl">
        <div className="flare-rule h-1.5 w-20" />
        <h1 className="display mt-5 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] text-ink-950">
          Money can't find sport.
          <br />
          <span className="text-flare-500">We're the market.</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-snug text-ink-500">
          We match Baltic clubs and athletes with the businesses that want their audience.
        </p>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2">
        <DoorCard
          tone="ink"
          eyebrow="For businesses"
          title="Back sport"
          body="Three questions. See who reaches your customers."
          cta="Find my matches"
          onClick={onSponsorStart}
        />
        <DoorCard
          tone="flare"
          eyebrow="For clubs & athletes"
          title="Get funded"
          body="Free profile. Sponsors find you."
          cta="Get discovered"
          onClick={onClubStart}
        />
      </div>

      <button
        onClick={onPricing}
        className="mt-7 self-start font-display text-[15px] font-medium text-ink-500 transition-colors hover:text-flare-500"
      >
        Clubs free · Sponsors €49/mo + commission on close →
      </button>
    </div>
  );
}
