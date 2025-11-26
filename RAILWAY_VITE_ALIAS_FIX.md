# 🔧 Railway Vite Alias Fix - Regex Pattern

## Problem
Vite resolves `@/lib/api` to `/app/web/src/lib/api` but can't find the file. The path is correct but Vite isn't adding the `.ts` extension automatically.

## Solution: Use Regex Pattern for Alias

Changed the alias to use a regex pattern that captures everything after `@/`:

```typescript
{
  find: /^@\/(.*)/,
  replacement: path.resolve(__dirname, "./src/$1"),
}
```

This ensures:
- `@/lib/api` → `./src/lib/api` → Vite adds `.ts` extension
- `@/components/Button` → `./src/components/Button` → Vite adds `.tsx` extension
- More explicit path resolution

## Why This Works

The regex pattern:
- `^@\/` - Matches `@/` at the start
- `(.*)` - Captures everything after `@/`
- `$1` - Uses the captured group in replacement

This gives Vite a cleaner path to resolve, and it can then add the appropriate extension.

## Alternative: If This Still Fails

If the regex pattern doesn't work, we might need to:

1. **Update imports to include extensions:**
   ```typescript
   // Change from:
   import { api } from "@/lib/api";
   
   // To:
   import { api } from "@/lib/api.ts";
   ```

2. **Or use a Vite plugin** to handle path resolution

But the regex pattern should work! 🎯

---

**Try this fix - the regex pattern should help Vite resolve paths correctly!**

