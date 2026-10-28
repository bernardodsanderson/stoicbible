import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitFeedback } from "@/lib/stoic/api-user";

export const Route = createFileRoute("/feedback")({ component: FeedbackPage });

function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-12">
        <h1 className="font-display text-4xl font-semibold">Contact us</h1>
        <p className="mt-2 text-muted">Bugs, ideas, or a kind word — write them here.</p>
        <form
          className="mt-8 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setPending(true);
            try {
              await submitFeedback({ data: { name, email, message } });
              toast.success("Feedback received. Thank you.");
              setMessage("");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not send");
            } finally {
              setPending(false);
            }
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={pending}>
            Send
          </Button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
