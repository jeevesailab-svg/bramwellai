import { createFileRoute, redirect } from "@tanstack/react-router";

// Retired. There is one offer now: the 30 Day Voice Mastery Program.
export const Route = createFileRoute("/pricing")({
  validateSearch: (search: Record<string, unknown>): { resume?: string; score?: number } => ({
    ...(typeof search.resume === "string" ? { resume: search.resume } : {}),
    ...(typeof search.score === "string" || typeof search.score === "number"
      ? { score: Number(search.score) }
      : {}),
  }),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/program",
      search: search,
    });
  },
  component: () => null,
});
