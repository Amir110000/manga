"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatCurrencyFa } from "@/utils/format";

export interface ProductCardProps {
  manhwa: {
    id: string;
    slug: string;
    titleFa: string;
    price: number;
    coverImage: string;
  };
}

export default function ProductCard({ manhwa }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="border border-black/10 rounded-lg overflow-hidden bg-white flex flex-col">
      <Link href={`/product/${manhwa.slug}`} className="block">
        <Image
          src={manhwa.coverImage}
          alt={manhwa.titleFa}
          width={400}
          height={600}
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col gap-2">
        <Link href={`/product/${manhwa.slug}`} className="font-semibold hover:underline line-clamp-2">
          {manhwa.titleFa}
        </Link>
        <div className="text-black/70 text-sm">{formatCurrencyFa(manhwa.price)}</div>
        <button
          onClick={() => addItem({
            id: manhwa.id,
            slug: manhwa.slug,
            titleFa: manhwa.titleFa,
            price: manhwa.price,
            coverImage: manhwa.coverImage,
          })}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-black/90"
        >
          افزودن به سبد
        </button>
      </div>
    </div>
  );
}