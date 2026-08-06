import { createFileRoute, redirect } from "@tanstack/react-router";

// Renamed to /founders.
export const Route = createFileRoute("/waitlist")({
  beforeLoad: () => {
    throw redirect({ to: "/founders" });
  },
  component: () => null,
});
