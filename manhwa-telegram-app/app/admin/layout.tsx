import { ReactNode } from "react";
import { getCurrentUser } from "@/app/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return <main className="min-h-[60vh] flex items-center justify-center">دسترسی غیرمجاز</main>;
  }
  return <>{children}</>;
}