"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const { totalCount } = useCart();

  return (
    <header className="w-full border-b border-black/10 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            مانهوا شاپ
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link href="/" className="hover:underline">
              خانه
            </Link>
            <Link href="/catalog" className="hover:underline">
              کاتالوگ
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative inline-flex items-center gap-2">
            <span>سبد خرید</span>
            <span className="inline-flex items-center justify-center text-xs min-w-6 h-6 rounded-full bg-black text-white px-2">
              {totalCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}