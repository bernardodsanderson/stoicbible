import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { ShareCardButton } from "@/components/share-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getJournal, getMyProfile, saveJournal } from "@/lib/stoic/api-user";

export function JournalEditor({ slug }: { slug?: string }) {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const profile = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getMyProfile(),
    enabled: !isPending && !!user,
  });
  const existing = useQuery({
    queryKey: ["journal", slug],
    queryFn: () => getJournal({ data: { slug: slug! } }),
    enabled: !!slug && !!user,
  });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing.data) {
      setTitle(existing.data.title ?? "");
      setBody(existing.data.body);
    }
  }, [existing.data]);

  if (isPending) return <div className="min-h-dvh bg-bg" />;
  if (!user) return <RedirectToSignIn />;

  async function onSave() {
    setSaving(true);
    try {
      const saved = await saveJournal({
        data: {
          slug,
          title: title.trim() || null,
          body,
          quoteText: existing.data?.quoteText ?? null,
          quoteAuthor: existing.data?.quoteAuthor ?? null,
          verseId: existing.data?.verseId ?? null,
        },
      });
      toast.success("Journal saved");
      const username = profile.data?.username;
      if (username) {
        await navigate({ to: "/$username/journals/$slug", params: { username, slug: saved.slug } });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SiteHeader dense />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display text-3xl font-semibold">
          {slug ? "Edit journal" : "New Journal"}
        </h1>
        {existing.data?.quoteText && (
          <blockquote className="mt-6 border-l-2 border-accent pl-4 text-sm italic text-muted">
            “{existing.data.quoteText}”
          </blockquote>
        )}
        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Morning notes"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your thoughts as they occur — as Marcus did."
              className="min-h-64"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void onSave()} disabled={saving || !body.trim()}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <ShareCardButton
              payload={{
                title: title.trim() || null,
                quote: existing.data?.quoteText,
                quoteAuthor: existing.data?.quoteAuthor,
                thought: body.trim(),
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
