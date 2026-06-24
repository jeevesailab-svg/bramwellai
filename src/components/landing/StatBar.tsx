export function StatBar() {
  const stats = [
    { value: "$400", label: "per session with a private communications coach — if you can get one booked" },
    { value: "340", label: "average applicants competing for the same role" },
    { value: "$15,000", label: "estimated career cost of sounding less senior than you are" },
  ];
  return (
    <section
      className="relative border-t border-border py-16 md:py-20"
      style={{ background: "oklch(0.12 0.02 255)" }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3 md:gap-6 md:px-10">
        {stats.map((s) => (
          <div key={s.value} className="text-center md:text-left">
            <div
              className="bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              {s.value}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}