import React from "react";
import { XCircle, Copy, KeyRound, HelpCircle } from "lucide-react";
import { AccountResult } from "../../types/otp";

interface AccountStatusNotFoundCardProps {
  data: AccountResult;
  copyToClipboard: (text: string, key: string, label?: string) => void;
  onGoAccountLookup?: () => void;
}

export const AccountStatusNotFoundCard: React.FC<AccountStatusNotFoundCardProps> = ({
  data,
  copyToClipboard,
  onGoAccountLookup,
}) => {
  return (
    <div
      className="p-3.5 rounded-xl border border-rose-500/40 space-y-2.5 text-xs animate-in fade-in zoom-in-95 duration-200"
      style={{
        background: "rgba(136, 19, 55, 0.2)",
        boxShadow: "0 4px 20px rgba(244, 63, 94, 0.12)",
      }}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
        <span className="font-bold text-[var(--ink)] uppercase flex items-center gap-1.5 text-[11px]">
          <XCircle className="w-4 h-4 text-rose-400" />
          Trạng Thái Tài Khoản
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          {data.status || "KHÔNG TỒN TẠI"}
        </span>
      </div>

      {/* Account Info */}
      <div className="space-y-1.5 text-[11px]">
        {/* Email Row with Copy */}
        <div
          className="flex items-center justify-between p-2 rounded-lg border border-[var(--line)]"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
        >
          <span className="font-mono font-bold text-[var(--ink)] truncate max-w-[280px]">
            {data.account}
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard(data.account, "notfound_acc_email", "Đã chép Email tra cứu!")}
            className="p-1 rounded border border-[var(--line)] hover:brightness-125 transition-all"
            title="Sao chép Email"
          >
            <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
          </button>
        </div>

        {/* Notice Message */}
        <div
          className="p-2.5 rounded-lg border border-rose-500/20 text-[11px] leading-relaxed space-y-1"
          style={{ background: "rgba(0, 0, 0, 0.3)" }}
        >
          <p className="text-rose-200/90 font-medium flex items-center gap-1">
            <span>Không tìm thấy tài khoản trong danh sách đơn hàng hoặc hệ thống.</span>
          </p>
          <p className="text-[10px] text-[var(--soft)]">
            Vui lòng kiểm tra lại chính xác địa chỉ email hoặc dùng tính năng Lấy Tài Khoản để tra cứu tài khoản được cấp theo mã đơn hàng.
          </p>
        </div>
      </div>

      {/* CTA Button: Tra Cứu Tài Khoản / Đơn Hàng */}
      {onGoAccountLookup && (
        <button
          type="button"
          onClick={onGoAccountLookup}
          className="w-full mt-2 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-[var(--line)] hover:brightness-125 shadow-md"
          style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--ink)" }}
        >
          <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
          Chuyển Sang Tra Cứu Tài Khoản / Mã Đơn Hàng
        </button>
      )}

      <div className="text-[9.5px] text-[var(--soft)]/70 text-center flex items-center justify-center gap-1 pt-0.5">
        <HelpCircle className="w-3 h-3" />
        <span>Nếu bạn vừa mua hàng, vui lòng liên hệ Admin / CSKH để được kích hoạt.</span>
      </div>
    </div>
  );
};

