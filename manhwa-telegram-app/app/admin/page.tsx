import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">داشبورد ادمین</h2>
      <ul className="space-y-2">
        <li><Link className="text-accent" href="/admin/manhwas">مدیریت مانهوا</Link></li>
        <li><Link className="text-accent" href="/admin/plans">پلن‌های اشتراک</Link></li>
        <li><Link className="text-accent" href="/admin/schedule">جدول هفتگی</Link></li>
        <li><Link className="text-accent" href="/admin/slider">اسلایدر</Link></li>
        <li><Link className="text-accent" href="/admin/chapters">ایجاد چپتر</Link></li>
      </ul>
    </main>
  );
}