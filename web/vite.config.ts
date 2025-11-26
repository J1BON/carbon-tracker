import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      root: __dirname,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@carbon-tracker/shared-types": path.resolve(__dirname, "../packages/shared-types/src"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts", ".json"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    port: 3000,
    host: true,
  },
});

