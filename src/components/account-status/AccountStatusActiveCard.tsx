import React from "react";
import { Zap, ShieldCheck, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { AccountResult } from "../../types/otp";

interface AccountStatusActiveCardProps {
  data: AccountResult;
  copyToClipboard?: (text: string, key: string, label?: string) => void;
  onGoOtp?: (account: string) => void;
}

export const AccountStatusActiveCard: React.FC<AccountStatusActiveCardProps> = ({
  data,
  onGoOtp,
}) => {
  return (
    <div
      className="p-4 rounded-2xl border border-emerald-500/35 text-xs animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden backdrop-blur-xl"
      style={{
        background:
          "linear-gradient(145deg, rgba(6, 78, 59, 0.28) 0%, rgba(3, 20, 16, 0.55) 100%)",
        boxShadow:
          "0 10px 30px -10px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(110, 231, 183, 0.25)",
      }}
    >
      {/* Ambient Cyber Light Effect */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-16 rounded-full pointer-events-none opacity-40 blur-xl"
        style={{ background: "radial-gradient(ellipse, #10b981 0%, transparent 70%)" }}
      />

      {/* 1. Header: Trạng Thái Tài Khoản + Active Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 relative z-10">
        <span className="font-extrabold text-[var(--ink)] uppercase flex items-center gap-1.5 text-[11px] tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Trạng Thái Tài Khoản
        </span>

        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/50 shadow-[0_0_14px_rgba(16,185,129,0.3)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          {data.status || "ACTIVE"}
        </span>
      </div>

      {/* 2. Khối Trọng Tâm: Animation Icon Ở Giữa + Tên Tổ Chức Chữ To Ra */}
      <div className="py-4 text-center relative z-10 flex flex-col items-center justify-center">
        {/* Animated Icon Core (Hào quang sóng phát sáng đa tầng) */}
        <div className="relative flex items-center justify-center mb-3">
          {/* Lớp sóng ngoài nhấp nháy êm */}
          <div className="absolute w-16 h-16 rounded-full bg-emerald-500/15 animate-ping duration-1000 opacity-60" />

          {/* Vòng hào quang phát sáng neon */}
          <div
            className="w-14 h-14 rounded-full border-2 border-emerald-400/60 bg-emerald-950/60 flex items-center justify-center relative shadow-[0_0_24px_rgba(16,185,129,0.45)] transition-transform hover:scale-105"
            style={{
              backdropFilter: "blur(8px)",
            }}
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-300 animate-in zoom-in duration-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
        </div>

        {/* Tag Phụ: Tổ chức / Đơn vị trường học */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-bold text-emerald-300/90 uppercase tracking-widest mb-1.5">
          <Building2 className="w-3 h-3 text-cyan-400" />
          <span>Tổ Chức / Trường Học</span>
        </div>

        {/* Tên Tổ Chức Chữ To Ra */}
        <h3
          className="text-base sm:text-lg font-black text-[var(--ink)] tracking-tight leading-snug max-w-md mx-auto px-2 break-words drop-shadow-sm"
          title={data.organization || "Adobe Managed Enterprise"}
        >
          {data.organization || "Adobe Managed Enterprise"}
        </h3>
      </div>

      {/* 3. Action CTA: Chuyển Sang Lấy Mã OTP Cho Email Này */}
      {onGoOtp && (
        <button
          type="button"
          onClick={() => onGoOtp(data.account)}
          className="w-full mt-1 py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:brightness-110 active:scale-[0.99] relative z-10 group"
          style={{
            background: "var(--btn)",
            color: "var(--btn-ink)",
            boxShadow: "0 4px 18px var(--glow)",
          }}
        >
          <Zap className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
          <span>Chuyển Sang Lấy Mã OTP Cho Email Này</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-75 group-hover:translate-x-1 transition-transform ml-0.5" />
        </button>
      )}
    </div>
  );
};
