/**
 * Safe Session Wrappers
 * Provides auth-safe alternatives to next-auth hooks and functions
 * When auth is disabled, returns safe defaults without triggering API calls
 */

import { ENABLE_AUTH } from './authFlag';

// Types kept minimal so callers don't explode
type Status = 'loading' | 'authenticated' | 'unauthenticated';
type SessionLike = any | null;

export function useSessionSafe(): { data: SessionLike; status: Status } {
  if (!ENABLE_AUTH) {
    return { data: null, status: 'unauthenticated' };
  }
  
  // Dynamic import avoids tree shaking pulling in next-auth in disabled mode
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useSession } = require('next-auth/react');
  return useSession();
}

export async function getSessionSafe(): Promise<SessionLike> {
  if (!ENABLE_AUTH) {
    return null;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getSession } = require('next-auth/react');
  try {
    return await getSession();
  } catch {
    return null;
  }
}
