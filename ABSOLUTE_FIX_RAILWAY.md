# 🔧 Absolute Fix for Railway - Path Resolution

## Critical Issue
Vite resolves `@/lib/api` to `/app/web/src/lib/api` but can't find the file. The path is correct but Vite isn't adding the `.ts` extension.

## Root Cause Analysis
When Railway builds from monorepo root:
- `__dirname` in `vite.config.ts` = `/app/web` ✅
- Alias `@` resolves to `/app/web/src` ✅  
- But Vite tries to load `/app/web/src/lib/api` (no extension) ❌

## Final Solution

### Updated `web/vite.config.ts`
Using `path.resolve(__dirname, "src")` (without `./`) to ensure absolute path resolution.

### Key Changes:
1. ✅ Removed `./` from path (just `"src"` not `"./src"`)
2. ✅ Using `path.resolve` for absolute paths
3. ✅ Extensions array includes `.ts` first

## If This Still Fails

### Option 1: Add explicit extensions to imports
Change all imports to include `.ts`:
```typescript
// Change from:
import { api } from "@/lib/api";

// To:
import { api } from "@/lib/api.ts";
```

### Option 2: Use Vite plugin
Install `vite-tsconfig-paths`:
```bash
npm install -D vite-tsconfig-paths
```

Then in `vite.config.ts`:
```typescript
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // ...
});
```

### Option 3: Check Railway build context
Ensure Railway is copying all files correctly. Check if `web/src/lib/api.ts` exists in the build context.

---

**Try the current fix first - it should work!** 🎯

