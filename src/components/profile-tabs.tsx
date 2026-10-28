import { Link } from "@tanstack/react-router";
import { Bookmark, Highlighter, NotebookPen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileTabs({
  username,
  active,
}: {
  username: string;
  active: "journals" | "highlights" | "bookmarks" | "settings";
}) {
  const items = [
    { id: "journals" as const, to: "/$username", label: "Journals", icon: NotebookPen },
    {
      id: "highlights" as const,
      to: "/$username/highlights",
      label: "Highlights",
      icon: Highlighter,
    },
    { id: "bookmarks" as const, to: "/$username/bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "settings" as const, to: "/$username/settings", label: "Settings", icon: Settings },
  ];
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        return (
          <Link
            key={item.id}
            to={item.to}
            params={{ username }}
            className={cn(
              "inline-flex h-12 items-center gap-2 px-3 text-sm whitespace-nowrap",
              isActive ? "border-b-2 border-accent text-fg" : "text-muted hover:text-fg",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
