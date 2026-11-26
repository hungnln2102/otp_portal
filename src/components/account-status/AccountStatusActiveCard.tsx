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
      className="p-3.5 rounded-2xl border border-emerald-500/35 text-xs animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden backdrop-blur-xl space-y-2.5"
      style={{
        background:
          "linear-gradient(150deg, rgba(6, 78, 59, 0.26) 0%, rgba(6, 18, 15, 0.72) 100%)",
        boxShadow:
          "0 10px 26px -10px rgba(16, 185, 129, 0.18), inset 0 1px 0 rgba(110, 231, 183, 0.2)",
      }}
    >
      {/* Ambient accent */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-14 rounded-full pointer-events-none opacity-30 blur-xl"
        style={{ background: "radial-gradient(ellipse, #10b981 0%, transparent 70%)" }}
      />

      {/* 1. Header gọn gàng */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-emerald-500/20 relative z-10">
        <span className="font-extrabold text-[var(--ink)] uppercase flex items-center gap-1.5 text-[11px] tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          Trạng Thái Tài Khoản
        </span>

        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/45 shadow-[0_0_12px_rgba(16,185,129,0.22)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {data.status || "ACTIVE"}
        </span>
      </div>

      {/* 2. Khối nội dung ngang gọn gàng */}
      <div className="flex items-center gap-3 text-left relative z-10 py-0.5">
        <div className="w-11 h-11 rounded-xl border border-emerald-400/50 bg-emerald-950/65 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(16,185,129,0.28)]">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-[9.5px] font-bold text-emerald-300/95 uppercase tracking-wider">
            <Building2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
            <span>Tổ chức / Trường học</span>
          </div>

          <h3
            className="text-sm sm:text-[15px] font-black text-[var(--ink)] tracking-tight leading-snug break-words"
            title={data.organization || "Adobe Managed Enterprise"}
          >
            {data.organization || "Adobe Managed Enterprise"}
          </h3>
        </div>
      </div>

      {/* 3. Action CTA */}
      {onGoOtp && (
        <button
          type="button"
          onClick={() => onGoOtp(data.account)}
          className="w-full py-2 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:brightness-110 active:scale-[0.99] relative z-10 group cursor-pointer"
          style={{
            background: "var(--btn)",
            color: "var(--btn-ink)",
            boxShadow: "0 4px 16px var(--glow)",
          }}
        >
          <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>Chuyển Sang Lấy Mã OTP Cho Email Này</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-75 group-hover:translate-x-1 transition-transform ml-0.5" />
        </button>
      )}
    </div>
  );
};
