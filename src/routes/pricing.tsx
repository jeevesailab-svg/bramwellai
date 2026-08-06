import { createFileRoute, redirect } from "@tanstack/react-router";

// Retired. There is one offer now: the 30 Day Voice Mastery Program.
export const Route = createFileRoute("/pricing")({
  validateSearch: (search: Record<string, unknown>) => ({
    resume: typeof search.resume === "string" ? search.resume : undefined,
    score:
      typeof search.score === "string" || typeof search.score === "number"
        ? Number(search.score)
        : undefined,
  }),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/program",
      search: { resume: search.resume, score: search.score },
    });
  },
  component: () => null,
});
