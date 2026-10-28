import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/membership")({ component: MembershipRedirect });

function MembershipRedirect() {
  return <Navigate to="/books" />;
}
