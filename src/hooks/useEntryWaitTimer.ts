import { useEffect, useRef, useState } from "react";

export const ENTRY_WAIT_SECONDS = 30;

/**
 * Đếm ngược thời gian chờ bắt buộc ngay khi người dùng vừa truy cập trang.
 * Dùng mốc thời gian thực (Date.now) để không bị trôi giờ khi chuyển tab nền.
 */
export function useEntryWaitTimer(initialSeconds: number = ENTRY_WAIT_SECONDS): number {
  const unlockAtRef = useRef<number>(Date.now() + initialSeconds * 1000);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    if (initialSeconds <= 0) {
      setRemainingSeconds(0);
      return;
    }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((unlockAtRef.current - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      return remaining;
    };

    if (tick() === 0) return;

    const timer = window.setInterval(() => {
      if (tick() === 0) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [initialSeconds]);

  return remainingSeconds;
}
