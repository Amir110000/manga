export default function PaymentSuccessPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center flex-col gap-4 text-center">
      <h2 className="text-2xl font-bold text-accent">پرداخت موفق</h2>
      <p className="opacity-80">با تشکر! پردازش حساب شما به‌زودی انجام می‌شود.</p>
      <a href="/" className="mt-2 rounded-full bg-accent text-accent-foreground px-5 py-2 hover:bg-accent/90">بازگشت به خانه</a>
    </main>
  );
}