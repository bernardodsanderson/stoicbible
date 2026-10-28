import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { PwaRoot } from "@/components/pwa";
import { MobileTabBar } from "@/components/site-header";
import { ThemeProvider, THEME_BOOT, isDarkTheme, useTheme } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth/provider";
import appCss from "../styles.css?url";

/**
 * Netlify injects a hosting-facts HTML comment (and, while the badge is on, a
 * HUD script) into served documents. React hydration compares the head tree,
 * and that extra comment makes it fail with error #418. Remove Netlify's
 * injected nodes during parse, before the deferred hydration module runs.
 */
const NETLIFY_INJECTION_CLEANUP = `(function () {
  function cleanHead() {
    var head = document.head;
    if (!head) return;
    for (var i = head.childNodes.length - 1; i >= 0; i -= 1) {
      var node = head.childNodes[i];
      if (node.nodeType === 8 && /hosted on Netlify/i.test(node.textContent || "")) {
        head.removeChild(node);
        continue;
      }
      // Netlify wraps its comment in newlines; those whitespace text nodes are
      // not part of React's server head and cause the same hydration mismatch.
      if (node.nodeType === 3 && !(node.textContent || "").trim()) {
        head.removeChild(node);
      }
    }
    var injected = document.querySelectorAll(
      'script[data-netlify-site-id], script[src*="/.netlify/scripts/hud"]',
    );
    for (var j = injected.length - 1; j >= 0; j -= 1) injected[j].remove();
  }
  cleanHead();
  var observer = new MutationObserver(cleanHead);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", cleanHead);
  window.setTimeout(function () { observer.disconnect(); }, 2000);
})();`;

const APP_NAME = "Stoic Bible";
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 20_000, retry: 1 } },
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Practice Stoicism by reading the old texts and writing your own meditations. A library, reader, and journal in one place.",
      },
      { name: "theme-color", content: "#141310", media: "(prefers-color-scheme: dark)" },
      { name: "theme-color", content: "#f3efe6", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#141310" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png?v=3" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function ThemeToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={isDarkTheme(theme) ? "dark" : "light"}
      position="top-center"
      toastOptions={{
        className: "bg-elevated text-fg border-border",
      }}
    />
  );
}

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: NETLIFY_INJECTION_CLEANUP }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="min-h-dvh bg-bg text-fg">
        <PwaRoot />
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <div className="flex min-h-dvh flex-col pb-14 md:pb-0">
                <Outlet />
                <MobileTabBar />
              </div>
              <ThemeToaster />
            </ThemeProvider>
          </QueryClientProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
