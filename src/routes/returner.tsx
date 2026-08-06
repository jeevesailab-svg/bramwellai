import { createFileRoute, redirect } from "@tanstack/react-router";

// Retired pathway page. Everything now funnels into the single program offer.
export const Route = createFileRoute("/returner")({
  beforeLoad: () => {
    throw redirect({ to: "/program", search: {} });
  },
  component: () => null,
});
