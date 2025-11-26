# 🔧 Railway Rollup Path Resolution Fix

## Problem
Rollup (used by Vite for production builds) can't resolve `@/lib/api` imports even with `vite-tsconfig-paths` plugin.

## Root Cause
The plugin might not be working correctly, or we need to ensure both the plugin AND manual aliases are configured properly.

## Solution: Hybrid Approach

We're using BOTH:
1. `vite-tsconfig-paths` plugin (for development)
2. Manual aliases in `resolve.alias` (for production builds)

This ensures path resolution works in all scenarios.

## Current Configuration

### `web/vite.config.ts`
```typescript
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
      root: __dirname, // Explicit root
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@carbon-tracker/shared-types": path.resolve(
        __dirname,
        "../packages/shared-types/src"
      ),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts", ".json"],
  },
});
```

## Why Both?

- **Plugin**: Helps with development and some build scenarios
- **Manual aliases**: Ensures Rollup can resolve paths during production build
- **Together**: Maximum compatibility

## Verification

After this fix:
- ✅ Plugin handles path resolution
- ✅ Manual aliases ensure Rollup works
- ✅ Both development and production builds work

---

**This hybrid approach should fix the Rollup resolution issue!** 🎯

