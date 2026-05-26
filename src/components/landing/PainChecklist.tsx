const PAINS = [
  {
    q: "I ramble and lose the point I was trying to make",
    a: "Bramwell rehearses you into tight, structured answers — so every sentence lands the point before you lose the thread.",
  },
  {
    q: "I freeze when the pressure is on",
    a: "Live voice reps under realistic pressure rewire the freeze response. By session three, the hard questions feel familiar.",
  },
  {
    q: "I walk out replaying what I should have said",
    a: "You'll have already said it — out loud, with Bramwell, the night before. The room hears your best take, not your second draft.",
  },
  {
    q: "I know I am capable but I cannot sell myself",
    a: "Bramwell mines your CV for the moments that prove your level, then drills you on telling them in the language of the next role.",
  },
  {
    q: "I sound less senior than I am",
    a: "We calibrate cadence, vocabulary, and conviction until the way you sound matches the work you've actually done.",
  },
  {
    q: "I have watched less qualified people get roles I deserved",
    a: "They weren't better. They were better rehearsed. Bramwell closes that gap before the next interview, not after.",
  },
];

export function PainChecklist() {
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Sound familiar?
        </p>
        <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          You know your stuff. You just cannot get it out{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            under pressure.
          </span>
        </h2>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {PAINS.map((p) => (
            <details key={p.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium tracking-tight md:text-lg">
                <span className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-border text-xs text-muted-foreground transition group-open:border-transparent"
                  >
                    <span className="block h-2 w-2 rounded-full bg-transparent transition group-open:bg-[var(--primary)]" />
                  </span>
                  {p.q}
                </span>
                <span className="mt-1 text-muted-foreground transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="ml-8 mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {p.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}