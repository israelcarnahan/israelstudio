/**
 * Auth Flag Module
 * Centralized control for enabling/disabling authentication system
 * When disabled, prevents all auth-related imports and API calls
 */

export const ENABLE_AUTH = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';
