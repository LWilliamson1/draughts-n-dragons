"use client";

import { CartProvider } from "@/contexts/CartContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
