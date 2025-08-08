"use client";
import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

export default function TelegramInit() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    try {
      const initData = WebApp.initData || (window as any)?.Telegram?.WebApp?.initData;
      if (initData) {
        fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        }).finally(() => setDone(true));
      } else {
        setDone(true);
      }
    } catch {
      setDone(true);
    }
  }, []);
  return done ? null : null;
}