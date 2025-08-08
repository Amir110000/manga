import { PrismaClient } from "@/app/generated/prisma";
import Link from "next/link";

const prisma = new PrismaClient();
const days: { key: string; label: string }[] = [
  { key: "MON", label: "دوشنبه" },
  { key: "TUE", label: "سه‌شنبه" },
  { key: "WED", label: "چهارشنبه" },
  { key: "THU", label: "پنجشنبه" },
  { key: "FRI", label: "جمعه" },
  { key: "SAT", label: "شنبه" },
  { key: "SUN", label: "یکشنبه" },
];

export default async function WeeklyScheduleBlock() {
  const schedules = await prisma.weeklySchedule.findMany({ include: { manhwa: true } });
  if (schedules.length === 0) return null;
  return (
    <section className="w-full">
      <h3 className="text-xl font-bold mb-2">جدول هفتگی</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {days.map((d) => (
          <div key={d.key} className="border border-accent/30 rounded-xl p-3">
            <div className="font-semibold mb-2">{d.label}</div>
            <ul className="space-y-1">
              {schedules.filter((s) => s.weekday === d.key).map((s) => (
                <li key={s.id} className="text-sm">
                  <Link className="text-accent hover:underline" href={`/manhwa/${s.manhwa.slug}`}>{s.manhwa.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}