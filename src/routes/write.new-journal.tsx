import { createFileRoute } from "@tanstack/react-router";
import { JournalEditor } from "@/components/journal-editor";

export const Route = createFileRoute("/write/new-journal")({
  component: () => <JournalEditor />,
});
