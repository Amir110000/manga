import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center flex-col gap-4 text-center">
      <h2 className="text-2xl font-bold">پرداخت ناموفق</h2>
      <p className="opacity-80">عملیات لغو شد یا با خطا مواجه شد. لطفاً دوباره تلاش کنید.</p>
      <Link className="mt-2 rounded-full border border-accent/50 px-5 py-2 hover:bg-accent/10" href="/">بازگشت به خانه</Link>
    </main>
  );
}