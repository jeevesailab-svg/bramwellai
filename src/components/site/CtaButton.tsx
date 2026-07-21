import type { ReactNode } from "react";
import { Mic } from "lucide-react";

type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, { h: string; icon: string; arrow: string }> = {
  sm: { h: "h-10 px-5 text-sm gap-2", icon: "h-3.5 w-3.5", arrow: "text-sm" },
  md: { h: "h-12 px-7 text-sm gap-2.5", icon: "h-4 w-4", arrow: "text-base" },
  lg: { h: "h-14 px-9 text-base gap-3", icon: "h-5 w-5", arrow: "text-lg" },
};

export function CtaButton({
  href,
  onClick,
  children,
  size = "md",
  className = "",
  showIcon = true,
  showArrow = true,
  as = "a",
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  size?: Size;
  className?: string;
  showIcon?: boolean;
  showArrow?: boolean;
  as?: "a" | "button";
}) {
  const s = SIZE[size];
  const cls = `group inline-flex ${s.h} items-center justify-center rounded-full font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:opacity-95 ${className}`;
  const style = { background: "var(--gradient-cta)", boxShadow: "var(--shadow-cta)" } as const;
  const inner = (
    <>
      {showIcon ? <Mic className={s.icon} strokeWidth={2.5} /> : null}
      <span>{children}</span>
      {showArrow ? <span className={`transition-transform group-hover:translate-x-0.5 ${s.arrow}`}>→</span> : null}
    </>
  );
  if (as === "button" || onClick) {
    return (
      <button type="button" onClick={onClick} className={cls} style={style}>
        {inner}
      </button>
    );
  }
  return (
    <a href={href} className={cls} style={style}>
      {inner}
    </a>
  );
}