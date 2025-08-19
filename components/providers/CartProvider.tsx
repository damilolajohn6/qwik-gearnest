/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCart();

  useEffect(() => {
    // Initialize cart on client side
    cart.totalItems; // This triggers the store initialization
  }, []);

  return <>{children}</>;
}
