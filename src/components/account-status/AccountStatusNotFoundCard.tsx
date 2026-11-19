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
      className="p-4 rounded-2xl border border-rose-500/35 text-xs animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden backdrop-blur-xl"
      style={{
        background:
          "linear-gradient(145deg, rgba(136, 19, 55, 0.28) 0%, rgba(30, 5, 15, 0.55) 100%)",
        boxShadow:
          "0 10px 30px -10px rgba(244, 63, 94, 0.2), inset 0 1px 0 rgba(253, 164, 175, 0.25)",
      }}
    >
      {/* Ambient Cyber Light Effect */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-16 rounded-full pointer-events-none opacity-40 blur-xl"
        style={{ background: "radial-gradient(ellipse, #f43f5e 0%, transparent 70%)" }}
      />

      {/* 1. Header: Trạng Thái Tài Khoản + Status Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-rose-500/20 relative z-10">
        <span className="font-extrabold text-[var(--ink)] uppercase flex items-center gap-1.5 text-[11px] tracking-wider">
          <XCircle className="w-4 h-4 text-rose-400" />
          Trạng Thái Tài Khoản
        </span>

        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/50 shadow-[0_0_14px_rgba(244,63,94,0.3)]">
          <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#fb7185]" />
          {data.status || "KHÔNG TỒN TẠI"}
        </span>
      </div>

      {/* 2. Khối Trọng Tâm: Animation Icon Ở Giữa + Thông Báo Rõ Ràng */}
      <div className="py-4 text-center relative z-10 flex flex-col items-center justify-center">
        {/* Animated Icon Core (Hào quang sóng đỏ rực) */}
        <div className="relative flex items-center justify-center mb-3">
          <div className="absolute w-16 h-16 rounded-full bg-rose-500/15 animate-ping duration-1000 opacity-60" />

          <div
            className="w-14 h-14 rounded-full border-2 border-rose-400/60 bg-rose-950/60 flex items-center justify-center relative shadow-[0_0_24px_rgba(244,63,94,0.45)] transition-transform hover:scale-105"
            style={{
              backdropFilter: "blur(8px)",
            }}
          >
            <XCircle className="w-8 h-8 text-rose-300 animate-in zoom-in duration-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          </div>
        </div>

        {/* Thông báo chữ to rõ ràng */}
        <h3 className="text-base sm:text-lg font-black text-rose-200 tracking-tight leading-snug max-w-md mx-auto px-2 drop-shadow-sm">
          Chưa Tìm Thấy Tài Khoản Này
        </h3>

        <p className="text-[11px] text-[var(--soft)] mt-1.5 max-w-sm mx-auto leading-relaxed">
          Email chưa có trong danh sách kích hoạt đơn hàng. Bạn vui lòng kiểm tra lại chính tả hoặc chuyển sang tra cứu theo mã đơn hàng.
        </p>
      </div>

      {/* 3. Action CTA: Chuyển Sang Tra Cứu Tài Khoản */}
      {onGoAccountLookup && (
        <button
          type="button"
          onClick={onGoAccountLookup}
          className="w-full mt-1 py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 border border-[var(--line)] hover:brightness-125 shadow-lg active:scale-[0.99] relative z-10 group"
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

      <div className="text-[9.5px] text-[var(--soft)]/70 text-center flex items-center justify-center gap-1 pt-2 relative z-10">
        <HelpCircle className="w-3 h-3 text-[var(--accent)]" />
        <span>Nếu bạn vừa thanh toán, vui lòng đợi 1–2 phút hoặc liên hệ CSKH để kích hoạt.</span>
      </div>
    </div>
  );
};
