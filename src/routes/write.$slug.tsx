import { createFileRoute } from "@tanstack/react-router";
import { JournalEditor } from "@/components/journal-editor";

export const Route = createFileRoute("/write/$slug")({
  component: WriteEdit,
});

function WriteEdit() {
  const { slug } = Route.useParams();
  return <JournalEditor slug={slug} />;
}
