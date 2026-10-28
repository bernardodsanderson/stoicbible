import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";
import { LogoMark } from "@/components/site-header";
import { useAppAccount } from "@/lib/stoic/use-app-account";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useAppAccount();
  if (!isPending && user) return <Navigate to="/home" />;
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <LogoMark className="mb-10" />
        <AuthForm mode="signin" />
      </div>
    </main>
  );
}
