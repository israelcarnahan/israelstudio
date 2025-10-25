# Auth Setup Guide

## Current Status: DISABLED
Authentication is currently disabled via `NEXT_PUBLIC_ENABLE_AUTH=false` in `.env.local`.

## To Re-enable Authentication:

1. **Update Environment Variable**
   ```bash
   # In .env.local, change:
   NEXT_PUBLIC_ENABLE_AUTH=true
   ```

2. **Verify Auth Configuration**
   - Ensure `NEXTAUTH_SECRET` is set in `.env.local`
   - Ensure `NEXTAUTH_URL` matches your deployment URL
   - Verify database connection for session storage (if using database sessions)

3. **Test Auth Flow**
   - Visit `/signin` to test login
   - Visit `/admin` to test protected routes
   - Check network tab for `/api/auth/session` calls

## What This Disables/Enables:

### When Disabled (`NEXT_PUBLIC_ENABLE_AUTH=false`):
- No SessionProvider mounted
- No `/api/auth/session` API calls
- All auth hooks return safe defaults
- Admin routes redirect to signin but won't authenticate
- No auth-related console errors

### When Enabled (`NEXT_PUBLIC_ENABLE_AUTH=true`):
- Full NextAuth.js functionality
- SessionProvider wraps the app
- Auth hooks work normally
- Protected routes enforce authentication
- Admin panel fully functional

## Files Modified for Auth Gating:
- `src/lib/authFlag.ts` - Central auth flag
- `src/lib/sessionSafe.ts` - Safe auth wrappers
- `src/components/providers.tsx` - Conditional SessionProvider
- All admin API routes - Use `getSessionSafe()`
- `src/app/admin/layout.tsx` - Use `getSessionSafe()`

## Troubleshooting:
- If you see auth errors after enabling, check your `.env.local` configuration
- Ensure your database is accessible if using database sessions
- Check that `NEXTAUTH_URL` matches your deployment URL
