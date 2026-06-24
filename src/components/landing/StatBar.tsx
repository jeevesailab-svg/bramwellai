export function StatBar() {
  const stats = [
    {
      value: "8",
      unit: "seconds",
      label:
        "the time a hiring manager forms their first impression of your communication style",
    },
    {
      value: "1 in 3",
      unit: null,
      label:
        "candidates say they lost a role to someone less qualified who simply communicated better",
    },
    {
      value: "73%",
      unit: null,
      label:
        "of hiring decisions are influenced by communication style — before qualifications are even considered",
    },
  ];
  return (
    <section
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
      style={{ background: "oklch(0.12 0.02 255)" }}
    >
      {/* subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, oklch(0.18 0.04 255 / 0.9) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Most people walk in underprepared.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              The numbers prove it.
            </span>
          </h2>
          <div
            className="mx-auto mt-8 h-px w-24"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          />
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:mt-20 md:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.value}
              className="group relative flex flex-col justify-between p-8 md:p-10"
              style={{ background: "oklch(0.12 0.02 255)" }}
            >
              <div
                aria-hidden
                className="absolute left-0 top-0 font-semibold leading-none text-foreground/[0.04] md:text-[8rem]"
                style={{ fontSize: "6rem" }}
              >
                0{i + 1}
              </div>
              <div className="relative">
                <div className="flex items-baseline gap-2">
                  <span
                    className="bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-6xl lg:text-7xl"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  >
                    {s.value}
                  </span>
                  {s.unit && (
                    <span className="text-lg font-medium text-foreground/70 md:text-xl">
                      {s.unit}
                    </span>
                  )}
                </div>
                <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground md:text-base">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}