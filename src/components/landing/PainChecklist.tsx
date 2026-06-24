const PAINS = [
  {
    q: "I ramble and lose the point I was trying to make",
    a: "Bramwell gives you PREP — a framework that structures any answer in under 60 seconds. You'll land the point before you lose the thread.",
  },
  {
    q: "I freeze when the pressure is on",
    a: "Bramwell drills you under pressure until freezing stops being your response. Live voice reps on the questions you dread most, until they feel familiar.",
  },
  {
    q: "I walk out replaying what I should have said",
    a: "Bramwell rehearses you the night before, out loud, on the exact moments you'll face. The room hears your best take — not your second draft on the drive home.",
  },
  {
    q: "I know I am capable but I cannot sell myself",
    a: "Bramwell mines your CV for the moments that prove your level, then drills you on telling them in the language of the role you actually want.",
  },
  {
    q: "I sound less senior than I am",
    a: "Bramwell calibrates your cadence, vocabulary, and conviction in real time — until the way you sound matches the work you've actually done.",
  },
  {
    q: "I have watched less qualified people get roles I deserved",
    a: "They weren't better. They were better rehearsed. Bramwell closes that gap before the next interview — not after you've lost it.",
  },
  {
    q: "People tell me I come across as boring or hard to read",
    a: "Bramwell works on the specific signals that make someone magnetic in conversation — pace, energy, warmth, and the ability to hold a room. You'll hear the difference within two sessions.",
  },
];

export function PainChecklist() {
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Your brain raced ahead of your mouth.{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            Again.
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