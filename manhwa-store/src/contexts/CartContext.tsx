"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  id: string;
  slug: string;
  titleFa: string;
  price: number; // in toman
  coverImage: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  increment: (slug: string) => void;
  decrement: (slug: string) => void;
  clear: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "manhwa-store-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        setItems(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    } catch {}
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.slug === item.slug);
      if (exists) {
        return prev.map((p) => (p.slug === item.slug ? { ...p, quantity: p.quantity + quantity } : p));
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  };

  const increment = (slug: string) => {
    setItems((prev) => prev.map((p) => (p.slug === slug ? { ...p, quantity: p.quantity + 1 } : p)));
  };

  const decrement = (slug: string) => {
    setItems((prev) => prev
      .map((p) => (p.slug === slug ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p))
      .filter((p) => p.quantity > 0)
    );
  };

  const clear = () => setItems([]);

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.quantity * i.price, 0), [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    increment,
    decrement,
    clear,
    totalCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}