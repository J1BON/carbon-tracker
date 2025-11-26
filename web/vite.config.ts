import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // Reads path aliases from tsconfig.json automatically
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts", ".json"],
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

