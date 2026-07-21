import { Link } from "@tanstack/react-router";
import { Mic } from "lucide-react";

export function StickyMobileCTA({
  label = "Talk to Bramwell free",
  href = "/diagnostic",
  search,
}: {
  label?: string;
  href?: string;
  search?: Record<string, string>;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 md:hidden">
      <div
        className="pointer-events-auto rounded-full border border-border bg-background/90 p-1.5 backdrop-blur-md"
        style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)" }}
      >
        <Link
          to={href}
          search={search ?? { autostart: "1" }}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition active:scale-[0.98]"
          style={{
            background: "var(--gradient-gold)",
          }}
        >
          <Mic className="h-4 w-4" strokeWidth={2.5} /> {label}
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}