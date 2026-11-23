import React from "react";
import { Clock, Lock } from "lucide-react";
import { ENTRY_WAIT_SECONDS } from "../hooks/useEntryWaitTimer";

interface OtpEntryWaitBannerProps {
  remainingSeconds: number;
  totalSeconds?: number;
}

export const OtpEntryWaitBanner: React.FC<OtpEntryWaitBannerProps> = ({
  remainingSeconds,
  totalSeconds = ENTRY_WAIT_SECONDS,
}) => {
  if (remainingSeconds <= 0) return null;

  const elapsed = Math.max(0, totalSeconds - remainingSeconds);
  const progressPercent = Math.min(100, Math.round((elapsed / Math.max(1, totalSeconds)) * 100));

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-amber-400/30 px-3 py-2 space-y-1.5 animate-in fade-in duration-200"
      style={{
        background:
          "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.65) 100%)",
      }}
    >
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-amber-200 font-semibold min-w-0">
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            Vui lòng chờ để mở khóa điền thông tin lấy OTP
          </span>
        </div>

        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 font-mono font-bold tabular-nums text-[11px]">
          <Clock className="w-3 h-3 shrink-0" />
          {remainingSeconds}s
        </span>
      </div>

      <div className="w-full h-1 rounded-full bg-black/50 overflow-hidden border border-white/10">
        <div
          className="h-full rounded-full transition-all duration-300 ease-linear"
          style={{
            width: `${progressPercent}%`,
            background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
          }}
        />
      </div>
    </div>
  );
};
