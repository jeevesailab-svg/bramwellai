/**
 * Bramwell - Single source of truth for design tokens.
 *
 * The actual values live as CSS custom properties in `src/styles.css`
 * (loaded once via `src/routes/__root.tsx`). This module exposes them to
 * TypeScript/JSX so every page and component references tokens through
 * one shared config instead of hardcoded strings.
 *
 * Usage:
 *   import { theme } from "@/lib/theme";
 *   <div style={{ background: theme.gradients.cta }} />
 *   <div className={theme.cx.gradientCta} />
 */

const cssVar = (name: string) => `var(--${name})`;

export const theme = {
  colors: {
    background: cssVar("background"),
    foreground: cssVar("foreground"),
    card: cssVar("card"),
    cardForeground: cssVar("card-foreground"),
    popover: cssVar("popover"),
    popoverForeground: cssVar("popover-foreground"),
    primary: cssVar("primary"),
    primaryForeground: cssVar("primary-foreground"),
    primaryGlow: cssVar("primary-glow"),
    secondary: cssVar("secondary"),
    secondaryForeground: cssVar("secondary-foreground"),
    muted: cssVar("muted"),
    mutedForeground: cssVar("muted-foreground"),
    accent: cssVar("accent"),
    accentForeground: cssVar("accent-foreground"),
    destructive: cssVar("destructive"),
    destructiveForeground: cssVar("destructive-foreground"),
    border: cssVar("border"),
    input: cssVar("input"),
    ring: cssVar("ring"),
    // Playful accents
    electric: cssVar("color-electric"),
    coral: cssVar("color-coral"),
    mint: cssVar("color-mint"),
    lemon: cssVar("color-lemon"),
  },
  gradients: {
    hero: cssVar("gradient-hero"),
    gold: cssVar("gradient-gold"),
    electric: cssVar("gradient-electric"),
    sunrise: cssVar("gradient-sunrise"),
    mint: cssVar("gradient-mint"),
    rainbow: cssVar("gradient-rainbow"),
    cta: cssVar("gradient-cta"),
  },
  shadows: {
    cta: cssVar("shadow-cta"),
    elegant: cssVar("shadow-elegant"),
    soft: cssVar("shadow-soft"),
  },
  radius: {
    sm: cssVar("radius-sm"),
    md: cssVar("radius-md"),
    lg: cssVar("radius-lg"),
    xl: cssVar("radius-xl"),
    "2xl": cssVar("radius-2xl"),
    "3xl": cssVar("radius-3xl"),
  },
  /**
   * Tailwind class fragments for the same tokens. Prefer these in JSX so
   * pages import the shared vocabulary rather than repeating arbitrary
   * `bg-[var(--token)]` fragments inline.
   */
  cx: {
    surface: "bg-background text-foreground",
    card: "bg-card text-card-foreground border-border",
    muted: "bg-muted text-muted-foreground",
    gradientHero: "bg-[image:var(--gradient-hero)]",
    gradientCta: "bg-[image:var(--gradient-cta)]",
    gradientGold: "bg-[image:var(--gradient-gold)]",
    gradientElectric: "bg-[image:var(--gradient-electric)]",
    gradientSunrise: "bg-[image:var(--gradient-sunrise)]",
    gradientMint: "bg-[image:var(--gradient-mint)]",
    gradientRainbow: "bg-[image:var(--gradient-rainbow)]",
    shadowCta: "shadow-[var(--shadow-cta)]",
    shadowElegant: "shadow-[var(--shadow-elegant)]",
    shadowSoft: "shadow-[var(--shadow-soft)]",
  },
} as const;

export type Theme = typeof theme;
export default theme;