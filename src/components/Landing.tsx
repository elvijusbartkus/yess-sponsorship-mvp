

function DoorCard({
  eyebrow,
  title,
  body,
  cta,
  onClick,
  primary,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 text-left transition-all duration-200 hover:-translate-y-1.5 sm:p-8 ${
        primary
          ? 'bg-ink-950 text-white hover:shadow-flare'
          : 'bg-white ring-1 ring-inset ring-paper-line hover:shadow-lift hover:ring-ink-950'
      }`}
    >
      {primary && <div className="flare-rule absolute inset-x-0 top-0 h-2" />}

      <p className={`eyebrow ${primary ? 'text-flare-400' : 'text-flare-600'}`}>{eyebrow}</p>

      <h2
        className={`display mt-4 text-3xl leading-[1.05] sm:text-4xl ${
          primary ? 'text-white' : 'text-ink-950'
        }`}
      >
        {title}
      </h2>

      <p
        className={`mt-3 flex-1 text-[15px] leading-relaxed ${
          primary ? 'text-ink-300' : 'text-ink-500'
        }`}
      >
        {body}
      </p>

      <span
        className={`mt-7 inline-flex items-center gap-2 font-display text-base font-medium ${
          primary ? 'text-flare-400' : 'text-ink-950'
        }`}
      >
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
    <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-24">
      <div className="animate-rise max-w-4xl">
        <div className="flare-rule h-2 w-28" />
        <h1 className="display mt-7 text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[0.9] text-ink-950">
          Money can't find
          <br />
          sport.
          <span className="text-flare-500"> We're the market.</span>
        </h1>
        <p className="mt-6 max-w-xl text-xl leading-snug text-ink-500">
          We match Baltic clubs and athletes with the businesses that want their audience.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <DoorCard
          primary
          eyebrow="For businesses"
          title="Back sport"
          body="Three questions. See who reaches your customers."
          cta="Find my matches"
          onClick={onSponsorStart}
        />
        <DoorCard
          eyebrow="For clubs & athletes"
          title="Get funded"
          body="Free profile. Sponsors find you."
          cta="Get discovered"
          onClick={onClubStart}
        />
      </div>

      <button
        onClick={onPricing}
        className="mt-10 font-display text-base font-medium text-ink-500 transition-colors hover:text-flare-500"
      >
        Clubs free · Sponsors €49/mo + commission on close →
      </button>
    </div>
  );
}
