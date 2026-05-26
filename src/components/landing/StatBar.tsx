export function StatBar() {
  const stats = [
    { value: "93%", label: "of candidates experience interview anxiety" },
    { value: "340", label: "average applicants per job posting" },
    { value: "$27,650", label: "average Australian student HECS debt" },
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