/**
 * DEV GUIDE: Local Storage Utilities
 * Purpose: Safe localStorage operations for cart persistence
 * Dependencies: None (browser APIs)
 * 
 * Handles localStorage safely with try/catch for SSR compatibility
 * Uses consistent key naming for cart data
 */

import type { CartLine } from "@/components/cart";

const CART_KEY = 'israelstudio:cart';

/**
 * Load cart data from localStorage
 * Returns empty array if no data or on error (SSR safe)
 */
export const loadCart = (): CartLine[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Save cart data to localStorage
 * Silently fails on error (SSR safe)
 */
export const saveCart = (items: CartLine[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // Silently fail - cart will work without persistence
  }
};
