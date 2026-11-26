import React from "react";
import { XCircle, KeyRound, HelpCircle, ArrowRight } from "lucide-react";
import { AccountResult } from "../../types/otp";

interface AccountStatusNotFoundCardProps {
  data: AccountResult;
  copyToClipboard?: (text: string, key: string, label?: string) => void;
  onGoAccountLookup?: () => void;
}

export const AccountStatusNotFoundCard: React.FC<AccountStatusNotFoundCardProps> = ({
  data,
  onGoAccountLookup,
}) => {
  return (
    <div
      className="p-3.5 rounded-2xl border border-rose-500/35 text-xs animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden backdrop-blur-xl space-y-2.5"
      style={{
        background:
          "linear-gradient(150deg, rgba(136, 19, 55, 0.26) 0%, rgba(22, 8, 14, 0.72) 100%)",
        boxShadow:
          "0 10px 26px -10px rgba(244, 63, 94, 0.18), inset 0 1px 0 rgba(253, 164, 175, 0.2)",
      }}
    >
      {/* Ambient accent */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-14 rounded-full pointer-events-none opacity-30 blur-xl"
        style={{ background: "radial-gradient(ellipse, #f43f5e 0%, transparent 70%)" }}
      />

      {/* 1. Header gọn gàng */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-rose-500/20 relative z-10">
        <span className="font-extrabold text-[var(--ink)] uppercase flex items-center gap-1.5 text-[11px] tracking-wider">
          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          Trạng Thái Tài Khoản
        </span>

        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/45 shadow-[0_0_12px_rgba(244,63,94,0.22)]">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          {data.status || "KHÔNG TỒN TẠI"}
        </span>
      </div>

      {/* 2. Khối nội dung ngang gọn gàng */}
      <div className="flex items-start gap-3 text-left relative z-10 py-0.5">
        <div className="w-11 h-11 rounded-xl border border-rose-400/50 bg-rose-950/65 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(244,63,94,0.28)]">
          <XCircle className="w-5 h-5 text-rose-300" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-sm sm:text-[15px] font-black text-rose-200 tracking-tight leading-snug">
            Chưa Tìm Thấy Tài Khoản Này
          </h3>
          <p className="text-[11px] text-[var(--soft)] leading-relaxed">
            Email chưa có trong danh sách kích hoạt đơn hàng. Vui lòng kiểm tra lại chính tả hoặc chuyển sang tra cứu theo mã đơn hàng.
          </p>
        </div>
      </div>

      {/* 3. Action CTA */}
      {onGoAccountLookup && (
        <button
          type="button"
          onClick={onGoAccountLookup}
          className="w-full py-2 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 border border-[var(--line)] hover:brightness-125 shadow-lg active:scale-[0.99] relative z-10 group cursor-pointer"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            color: "var(--ink)",
          }}
        >
          <KeyRound className="w-3.5 h-3.5 text-[var(--accent)] group-hover:rotate-45 transition-transform" />
          <span>Chuyển Sang Tra Cứu Mã Đơn Hàng</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-75 group-hover:translate-x-1 transition-transform ml-0.5" />
        </button>
      )}

      <div className="text-[10px] text-[var(--soft)]/75 text-center flex items-center justify-center gap-1 relative z-10">
        <HelpCircle className="w-3 h-3 text-[var(--accent)] shrink-0" />
        <span>Nếu bạn vừa thanh toán, vui lòng đợi 1–2 phút hoặc liên hệ CSKH để kích hoạt.</span>
      </div>
    </div>
  );
};
