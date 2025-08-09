"use client";

import { useCart } from "@/contexts/CartContext";
import { ManhwaItem } from "@/data/manhwas";

export function CartAddButton({ item }: { item: ManhwaItem }) {
  const { addItem } = useCart();
  return (
    <button
      onClick={() =>
        addItem({ id: item.id, slug: item.slug, titleFa: item.titleFa, price: item.price, coverImage: item.coverImage })
      }
      className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 hover:bg-black/90"
    >
      افزودن به سبد خرید
    </button>
  );
}