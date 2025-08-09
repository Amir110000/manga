import Link from "next/link";

export const metadata = {
  title: "خرید موفق | مانهوا شاپ",
};

export default function CheckoutSuccessPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">خرید شما با موفقیت انجام شد</h1>
      <p className="text-black/70 mb-6">از اعتماد شما به مانهوا شاپ سپاسگزاریم. لینک‌های مطالعه به‌زودی برای شما فعال می‌شود.</p>
      <Link href="/" className="underline">بازگشت به خانه</Link>
    </main>
  );
}