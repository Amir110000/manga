"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPageClient() {
  const router = useRouter();
  const { clear, totalPrice } = useCart();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clear();
    router.push("/checkout/success");
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">تکمیل اطلاعات خرید</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm mb-1">نام و نام خانوادگی</label>
          <input required className="w-full rounded-md border px-3 py-2" placeholder="مثلاً: علی رضایی" />
        </div>
        <div>
          <label className="block text-sm mb-1">ایمیل</label>
          <input type="email" required className="w-full rounded-md border px-3 py-2" placeholder="example@email.com" />
        </div>
        <div>
          <label className="block text-sm mb-1">شماره موبایل</label>
          <input required className="w-full rounded-md border px-3 py-2" placeholder="09xxxxxxxxx" />
        </div>
        <div>
          <label className="block text-sm mb-1">آدرس</label>
          <textarea required className="w-full rounded-md border px-3 py-2" rows={3} placeholder="استان، شهر، خیابان..." />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-black/70">پرداخت: درگاه آزمایشی</div>
          <div className="font-bold">مبلغ نهایی: {new Intl.NumberFormat("fa-IR").format(totalPrice)} تومان</div>
        </div>
        <button type="submit" className="mt-2 inline-flex items-center justify-center rounded-md bg-green-600 text-white px-4 py-2 hover:bg-green-700">
          پرداخت و تکمیل خرید
        </button>
      </form>
    </main>
  );
}