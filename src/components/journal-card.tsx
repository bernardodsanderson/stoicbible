import { useNavigate } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { ShareCardButton } from "@/components/share-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteJournal } from "@/lib/stoic/api-user";
import type { JournalCard as JournalCardType } from "@/lib/stoic/types";
import { relativeTime } from "@/lib/utils";

export function JournalCard({
  journal,
  username,
  canEdit = false,
  onDeleted,
}: {
  journal: JournalCardType;
  username?: string;
  canEdit?: boolean;
  onDeleted?: () => void;
}) {
  const navigate = useNavigate();
  const href = username ? `/${username}/journals/${journal.slug}` : `/write/${journal.slug}`;
  const truncated = journal.body.length > 280 ? `${journal.body.slice(0, 280)}…` : journal.body;

  async function onDelete() {
    if (!confirm("Delete this journal?")) return;
    await deleteJournal({ data: { slug: journal.slug } });
    toast.success("Journal deleted successfully!");
    onDeleted?.();
  }

  return (
    <article className="rounded-xl border border-border bg-elevated p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <a href={href} className="font-display text-xl font-semibold hover:opacity-80">
            {journal.title || "Untitled"}
          </a>
          <p className="mt-1 text-xs text-subtle">{relativeTime(journal.updatedAt)}</p>
        </div>
        {canEdit && (
          <div className="flex items-center gap-1">
            <ShareCardButton
              size="icon"
              variant="ghost"
              payload={{
                title: journal.title,
                quote: journal.quoteText,
                quoteAuthor: journal.quoteAuthor,
                thought: journal.body,
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Journal menu">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    void navigate({ to: "/write/$slug", params: { slug: journal.slug } })
                  }
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void onDelete()}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      {journal.quoteText && (
        <blockquote className="mt-4 border-l-2 border-accent pl-4 text-sm italic text-muted">
          “{journal.quoteText}”
          {journal.quoteAuthor ? (
            <span className="mt-1 block not-italic text-xs">— {journal.quoteAuthor}</span>
          ) : null}
        </blockquote>
      )}
      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-fg">
        {truncated}
        {journal.body.length > 280 && (
          <a href={href} className="ml-1 text-muted underline-offset-4 hover:underline">
            click to expand
          </a>
        )}
      </p>
    </article>
  );
}
