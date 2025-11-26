# 🔧 Vite Path Resolution Fix

## Problem
Vite can't find `/app/web/src/lib/api` - it's looking for the file without extension and not resolving the path alias correctly.

## Root Cause
When running in a monorepo from Railway, the path resolution in `vite.config.ts` might not work correctly with `__dirname` in ES modules.

## Fix Applied

### Updated `web/vite.config.ts`
1. **Added proper `__dirname` for ES modules:**
   ```typescript
   import { fileURLToPath } from "url";
   const __dirname = path.dirname(fileURLToPath(import.meta.url));
   ```

2. **Added explicit file extensions:**
   ```typescript
   resolve: {
     extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
   }
   ```

## Alternative Fix (If Above Doesn't Work)

If the path still doesn't resolve, try making the alias more explicit:

```typescript
resolve: {
  alias: {
    "@": path.resolve(process.cwd(), "web/src"),
    // Or if running from web directory:
    "@": path.resolve(__dirname, "src"),
  },
}
```

## Testing

After the fix, the build should:
1. ✅ Resolve `@/lib/api` to `src/lib/api.ts`
2. ✅ Resolve `@/lib/utils` to `src/lib/utils.ts`
3. ✅ Build successfully

---

**The path resolution should now work correctly!** 🎯

