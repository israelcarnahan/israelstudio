/**
 * RAF Throttle Utility
 * Prevents excessive scroll/resize handler calls by throttling with requestAnimationFrame
 * Reduces long tasks and forced reflow warnings in performance monitoring
 */

export function rafThrottle<T extends (...args: any[]) => void>(fn: T): T {
  let ticking = false as boolean;
  // @ts-ignore
  return function(this: any, ...args: any[]) {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      fn.apply(this, args);
      ticking = false;
    });
  } as T;
}
