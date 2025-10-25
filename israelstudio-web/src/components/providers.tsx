"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./cart";

export function Providers({ children }: { children: React.ReactNode }) {
  const enableAuth = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';
  
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
