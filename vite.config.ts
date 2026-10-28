import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// `@netlify/vite-plugin-tanstack-start` configures the production build
// (SSR + server functions → Netlify Functions) and emulates Netlify locally.
export default defineConfig(() => {
  return {
    server: {
      host: "0.0.0.0",
      // 8080 is the default; PORT lets you use another port when 8080 is taken.
      port: Number(process.env.PORT) || 8080,
      strictPort: true,
    },
    preview: {
      host: "127.0.0.1",
      port: 8081,
      strictPort: true,
    },
    resolve: { tsconfigPaths: true },
    plugins: [
      tailwindcss(),
      tanstackStart(),
      // Edge Functions need Deno; this app only uses server functions.
      netlify({ dev: { edgeFunctions: { enabled: false } } }),
      viteReact(),
    ],
  };
});
