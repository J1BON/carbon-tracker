# 🔧 Final Vite Path Resolution Fix

## Problem
Vite resolves `@/lib/api` to `/app/web/src/lib/api` but can't find the file (missing `.ts` extension in resolution).

## Root Cause
The alias path might not be resolving correctly, or Vite needs the path to be more explicit.

## Fix Applied

### Updated `web/vite.config.ts`
1. **Changed alias back to object format** (simpler, more reliable)
2. **Added `./` prefix** to src path: `"./src"` instead of `"src"`
3. **Reordered extensions** - put `.ts` and `.tsx` first (most common)

## Alternative: Check if files need explicit extensions

If this still doesn't work, we might need to update imports to include `.ts` extension:

**Change from:**
```typescript
import { api } from "@/lib/api";
```

**To:**
```typescript
import { api } from "@/lib/api.ts";
```

But this should NOT be necessary - Vite should handle it automatically.

## Debug Steps

If build still fails, check:

1. **File exists:** Verify `web/src/lib/api.ts` exists
2. **Path resolution:** Check if `__dirname` is correct in Railway
3. **Working directory:** Ensure build runs from correct directory

## Expected Result

After this fix:
- ✅ Vite resolves `@/lib/api` → `src/lib/api.ts`
- ✅ Vite finds the file with `.ts` extension
- ✅ Build succeeds

---

**Try this fix - the `./` prefix and extension order should help!** 🎯

