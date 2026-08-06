import { createFileRoute, redirect } from "@tanstack/react-router";

// Retired pathway page. Everything now funnels into the single program offer.
export const Route = createFileRoute("/executive")({
  beforeLoad: () => {
    throw redirect({ to: "/program" });
  },
  component: () => null,
});
