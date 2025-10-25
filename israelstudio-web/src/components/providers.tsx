"use client";
import React from "react";
import { ENABLE_AUTH } from "@/lib/authFlag";
import { CartProvider } from "./cart";

export function Providers({ children }: { children: React.ReactNode }) {
  // Hard off-switch: no SessionProvider when auth disabled
  if (!ENABLE_AUTH) {
    return (
      <CartProvider>
        {children}
      </CartProvider>
    );
  }
  
  // Late require to avoid eager import when disabled
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SessionProvider } = require('next-auth/react');
  
  return (
    <SessionProvider 
      refetchOnWindowFocus={false} 
      refetchInterval={0}
    >
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
}
