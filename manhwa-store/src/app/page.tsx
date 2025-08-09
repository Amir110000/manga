import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center md:text-right">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-10">
          مانهواهای محبوب را با بهترین قیمت تهیه کنید
        </h1>
        <p className="mt-3 text-black/70">
          آرشیوی از بهترین مانهواهای روز دنیا با ترجمه فارسی و دسترسی سریع.
        </p>
        <div className="mt-6 flex justify-center md:justify-start gap-3">
          <Link href="/catalog" className="inline-flex items-center justify-center rounded-md bg-black text-white px-5 py-3 hover:bg-black/90">
            مشاهده کاتالوگ
          </Link>
          <Link href="/cart" className="inline-flex items-center justify-center rounded-md border px-5 py-3 hover:bg-black/5">
            مشاهده سبد خرید
          </Link>
        </div>
      </section>
    </main>
  );
}
