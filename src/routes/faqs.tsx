import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/faqs")({ component: FaqsPage });

const FAQS = [
  {
    q: "What is Stoic Bible?",
    a: "Stoic Bible helps you learn Stoicism by practising the two exercises the ancient teachers gave their students: reading and writing. The library gathers public-domain works in one place. While reading you can take notes, highlight, bookmark, and share a line. The journal is for thoughts as they occur — an opportunity to write your own meditations, as Marcus Aurelius did.",
  },
  {
    q: "Where do you get the books from?",
    a: "All books are curated from the public domain. Most can be found on Wikisource.",
  },
  {
    q: "Does it cost any money?",
    a: "No. The library, reader, journals, highlights, bookmarks, and quotes are free. Sign in only if you want your notes saved to your account.",
  },
  {
    q: "Can I install it and read offline?",
    a: "Yes. Use Install or Add to Home Screen from the browser menu (there is also a Download page in the footer). Open a book, tap Save offline, and those chapters stay readable without a connection.",
  },
  {
    q: "How can I make sure my journals stay private?",
    a: "Journals are always private — only you can read them. If you want to share a line or a thought, use Share to make a card. The card is an image you send; it does not publish the journal on the site.",
  },
  {
    q: "How do Highlights work?",
    a: "Select text in the reader. A custom menu appears with Highlight, Thoughts, and Quote.",
  },
  {
    q: "What is Action?",
    a: "A short practice beside the books: a reading path for what is bothering you, one small rep for the week, and two sorting tools. The library is still the main work.",
  },
  {
    q: "Who built this?",
    a: "This web app is a practice companion inspired by the original Stoic Bible product. It is built so the signup works, the library is readable, and the journal is yours.",
  },
];

function FaqsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-4xl font-semibold">FAQs</h1>
        <dl className="mt-10 space-y-8">
          {FAQS.map((item) => (
            <div key={item.q}>
              <dt className="font-display text-2xl">{item.q}</dt>
              <dd className="mt-2 leading-relaxed text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-sm text-muted">
          Still stuck?{" "}
          <Link to="/feedback" className="underline-offset-4 hover:underline">
            Send feedback
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
