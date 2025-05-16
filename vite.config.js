// vite.config.js
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import history from "connect-history-api-fallback";

export default defineConfig({
  plugins: [createHtmlPlugin()],
  server: {
    host: true,
    middleware: [history()], // Dodaj middleware
  },
});
