import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { join, resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "/@/": join(__dirname, "src") + "/",
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: resolve(
      __dirname,
      "..",
      "..",
      "main",
      "dist",
      "public",
      "dispatch_panel",
    ),
  },
});
