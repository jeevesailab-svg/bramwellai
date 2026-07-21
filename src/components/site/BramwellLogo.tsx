export function BramwellLogo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <defs>
          <linearGradient id="bramwell-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="oklch(0.72 0.22 40)" />
            <stop offset="0.5" stopColor="oklch(0.66 0.24 340)" />
            <stop offset="1" stopColor="oklch(0.68 0.19 265)" />
          </linearGradient>
        </defs>
        {/* Speech bubble */}
        <path
          d="M8 6h24a4 4 0 014 4v16a4 4 0 01-4 4H18l-6 6v-6h-4a4 4 0 01-4-4V10a4 4 0 014-4z"
          fill="url(#bramwell-grad)"
        />
        {/* Mic */}
        <rect x="17" y="12" width="6" height="10" rx="3" fill="white" />
        <path d="M14 20a6 6 0 0012 0" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <line x1="20" y1="26" x2="20" y2="29" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="text-xl font-semibold tracking-tight text-foreground">
        Bramwell<span className="ml-0.5 bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>.ai</span>
      </span>
    </span>
  );
}