"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatCurrencyFa, toFaDigits } from "@/utils/format";

export default function CartPageClient() {
  const { items, increment, decrement, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-xl font-bold mb-4">سبد خرید خالی است</h1>
        <Link href="/catalog" className="underline">بازگشت به کاتالوگ</Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">سبد خرید</h1>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.slug} className="flex items-center gap-4 border border-black/10 rounded-md p-3 bg-white">
            <Image src={item.coverImage} alt={item.titleFa} width={64} height={96} className="rounded-sm object-cover" />
            <div className="flex-1 flex flex-col gap-1">
              <div className="font-medium">{item.titleFa}</div>
              <div className="text-sm text-black/60">{formatCurrencyFa(item.price)}</div>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => increment(item.slug)} className="w-8 h-8 rounded border">+</button>
                <span className="min-w-6 text-center">{toFaDigits(item.quantity)}</span>
                <button onClick={() => decrement(item.slug)} className="w-8 h-8 rounded border">-</button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-black/70">{formatCurrencyFa(item.price * item.quantity)}</div>
              <button onClick={() => removeItem(item.slug)} className="text-red-600 text-xs underline">حذف</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <div className="text-black/70">مجموع</div>
        <div className="text-lg font-bold">{formatCurrencyFa(totalPrice)}</div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link href="/checkout" className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 hover:bg-black/90">
          ادامه فرایند خرید
        </Link>
      </div>
    </main>
  );
}