import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, UserRound } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { ThemeToggle } from "@/components/theme-provider";
import { UserButton } from "@/lib/auth/gates";
import { useAppAccount } from "@/lib/stoic/use-app-account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const subscribeToNothing = () => () => {};

function useIsHydrated() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)}>
      <img src="/logo.png?v=3" alt="" className="h-12 w-12 object-contain" />
      <span className="font-display text-xl font-semibold tracking-tight">Stoic Bible</span>
    </Link>
  );
}

export function AuthSlot() {
  const { user, isPending } = useAppAccount();
  const hydrated = useIsHydrated();
  if (!hydrated || isPending) {
    return <div className="h-8 w-24 animate-pulse rounded-full bg-border" />;
  }
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/home" className="hidden text-sm text-muted hover:text-fg sm:inline">
          Home
        </Link>
        <Button variant="ghost" size="icon" className="sm:hidden" asChild>
          <Link to="/home" aria-label="Account">
            <UserRound />
          </Link>
        </Button>
        <div className="hidden sm:block">
          <UserButton />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" asChild>
        <Link to="/login">Sign In</Link>
      </Button>
    </div>
  );
}

export function SiteHeader({ dense = false }: { dense?: boolean }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    void navigate({ to: "/search", search: { q: query } });
  };
  return (
    <header
      className={cn(
        "border-b border-border bg-bg pt-[env(safe-area-inset-top)]",
        dense ? "py-2" : "py-3",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4">
        <LogoMark />
        <nav className="ml-4 hidden items-center gap-4 text-sm text-muted md:flex">
          <Link
            to="/books"
            className={cn("hover:text-fg", pathname.startsWith("/books") && "text-fg")}
          >
            All Books
          </Link>
          <Link
            to="/quotes"
            className={cn("hover:text-fg", pathname.startsWith("/quotes") && "text-fg")}
          >
            Quotes
          </Link>
          <Link
            to="/action"
            className={cn("hover:text-fg", pathname.startsWith("/action") && "text-fg")}
          >
            Action
          </Link>
        </nav>
        <form
          onSubmit={onSearch}
          className="ml-auto hidden max-w-xs flex-1 items-center gap-2 sm:flex"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Stoic Bible"
              className="h-10 pl-9"
              aria-label="Search Stoic Bible"
            />
          </div>
        </form>
        <div className="ml-auto flex items-center gap-1 sm:ml-2">
          <Button variant="ghost" size="icon" className="sm:hidden" asChild>
            <Link to="/search" search={{ q: "" }} aria-label="Search">
              <Search />
            </Link>
          </Button>
          <ThemeToggle />
          <AuthSlot />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-5">
        <div>
          <p className="font-display text-lg font-semibold">Stoic Bible</p>
          <p className="mt-2 text-sm text-muted">Ancient wisdom for a disciplined life.</p>
        </div>
        <FooterCol
          title="Product"
          links={[
            { to: "/books", label: "All Books" },
            { to: "/quotes", label: "Quotes" },
            { to: "/action", label: "Action" },
          ]}
        />
        <FooterCol
          title="Help"
          links={[
            { to: "/faqs", label: "FAQs" },
            { to: "/feedback", label: "Contact Us" },
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            { to: "/terms", label: "Terms" },
            { to: "/privacy", label: "Privacy" },
          ]}
        />
        <FooterCol
          title="More"
          links={[
            { to: "/app", label: "Download" },
            { to: "/donate", label: "Donate" },
          ]}
        />
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-subtle">
        Public-domain texts.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <a href={l.to} className="text-muted hover:text-fg">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useAppAccount();
  if (isPending || !user) return null;
  if (pathname.startsWith("/read/") || pathname === "/login" || pathname === "/signup") return null;
  const items = [
    { to: "/home", label: "Home" },
    { to: "/books", label: "Library" },
    { to: "/action", label: "Action" },
    { to: "/write/new-journal", label: "Write" },
    { to: "/quotes", label: "Quotes" },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active =
            pathname === item.to || (item.to !== "/home" && pathname.startsWith(item.to));
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex h-14 items-center justify-center text-xs",
                  active ? "text-fg" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
