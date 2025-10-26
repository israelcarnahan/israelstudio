/**
 * DEV GUIDE: Stock Policy Module
 * Purpose: Future-proof stock enforcement system for cart quantity management
 * Dependencies: None (pure functions)
 * 
 * Current behavior: No inventory system → allows any reasonable quantity
 * Future behavior: Will integrate with admin inventory system to enforce stock limits
 * 
 * Usage: Used by cart store to clamp quantities before setting them
 */

/**
 * Get the maximum purchasable quantity for a product
 * Today: No inventory system → return infinity (no limit)
 * Future: Will call admin API to get actual stock levels
 */
export async function getMaxPurchasableQty(productId: string): Promise<number> {
  // Today: no inventory → allow anything reasonable
  return Number.POSITIVE_INFINITY;
}

/**
 * Clamp a requested quantity to valid bounds
 * Ensures quantity is at least 1 and respects stock limits
 */
export async function clampQty(productId: string, requested: number): Promise<number> {
  const max = await getMaxPurchasableQty(productId);
  
  // Ensure quantity is at least 1
  const minQty = 1;
  
  // If max is finite, respect the stock limit
  if (Number.isFinite(max)) {
    return Math.max(minQty, Math.min(requested, max));
  }
  
  // No stock limit, just ensure minimum
  return Math.max(minQty, requested);
}

/**
 * Check if a product has stock limits (for UI hints)
 * Returns true if max quantity is finite (has stock system)
 */
export async function hasStockLimit(productId: string): Promise<boolean> {
  const max = await getMaxPurchasableQty(productId);
  return Number.isFinite(max);
}
