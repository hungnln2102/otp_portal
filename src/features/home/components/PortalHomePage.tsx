import React from "react";
import { ArrowRight, KeyRound, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { FestivalStage } from "../../festivals/components/FestivalStage";

interface PortalHomePageProps {
  themeTitle: string;
  themeSubtitle: string;
  onNavigateSystem: () => void;
  onNavigatePrice: () => void;
}

export const PortalHomePage: React.FC<PortalHomePageProps> = ({
  themeTitle,
  themeSubtitle,
  onNavigateSystem,
  onNavigatePrice,
}) => {
  return (
    <main className="main-stage flex-1 flex flex-col justify-center items-center px-4 py-2 relative z-10 overflow-hidden">
      <FestivalStage title={themeTitle} subtitle={themeSubtitle} />

      <div
        className="max-w-2xl w-full rounded-[26px] border border-[var(--line)] backdrop-blur-2xl p-5 sm:p-7 text-center relative overflow-hidden transition-all duration-300"
        style={{
          background: "var(--panel)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px var(--glow)",
        }}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--line)] bg-black/35 text-[11px] font-bold tracking-wide text-[var(--accent)] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TRUNG TÂM DỊCH VỤ MAVRYK PREMIUM</span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--ink)]">
          Chọn khu vực bạn muốn truy cập
        </h2>
        <p className="text-xs text-[var(--soft)] mt-1 mb-5">
          Truy cập nhanh cổng nhận mã xác minh tự động hoặc xem bảng giá dịch vụ bản quyền chính thức.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
          <button
            type="button"
            onClick={onNavigateSystem}
            className="group relative rounded-2xl border border-[var(--line)] p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 flex flex-col justify-between gap-4 cursor-pointer"
            style={{
              background: "rgba(0, 0, 0, 0.42)",
              boxShadow: "0 10px 28px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center border border-[var(--line)] shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{
                  background: "var(--btn)",
                  color: "var(--btn-ink)",
                  boxShadow: "0 4px 16px var(--glow)",
                }}
              >
                <KeyRound className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/35 bg-emerald-500/15 text-emerald-300">
                <ShieldCheck className="w-3 h-3" />
                Trực tuyến
              </span>
            </div>

            <div>
              <div className="text-base font-extrabold text-[var(--ink)] mb-1">
                Hệ Thống
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--soft)]">
                Cổng cấp mã OTP Adobe, Netflix, ChatGPT & xác thực 2FA tự động 24/7.
              </p>
            </div>

            <div
              className="w-full py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all"
              style={{
                background: "var(--btn)",
                color: "var(--btn-ink)",
                boxShadow: "0 4px 14px var(--glow)",
              }}
            >
              <span>Vào Hệ Thống</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </button>

          <button
            type="button"
            onClick={onNavigatePrice}
            className="group relative rounded-2xl border border-[var(--line)] p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 flex flex-col justify-between gap-4 cursor-pointer"
            style={{
              background: "rgba(0, 0, 0, 0.42)",
              boxShadow: "0 10px 28px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center border border-[var(--line)] shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "var(--accent)",
                }}
              >
                <Tag className="w-5 h-5" />
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--line)]"
                style={{ background: "rgba(255, 255, 255, 0.06)", color: "var(--accent)" }}
              >
                Cập nhật mới
              </span>
            </div>

            <div>
              <div className="text-base font-extrabold text-[var(--ink)] mb-1">
                Bảng Giá
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--soft)]">
                Tra cứu bảng giá dịch vụ & các gói phần mềm bản quyền niêm yết công khai.
              </p>
            </div>

            <div
              className="w-full py-2.5 px-3.5 rounded-xl text-xs font-extrabold border border-[var(--line)] flex items-center justify-between transition-all group-hover:border-[var(--accent)]"
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                color: "var(--ink)",
              }}
            >
              <span>Xem Bảng Giá</span>
              <ArrowRight className="w-4 h-4 text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </button>
        </div>

        <div className="pt-3 mt-5 border-t border-[var(--line)] flex items-center justify-between text-[10px] text-[var(--soft)]">
          <span>© 2026 Mavryk Premium • Bảo mật SSL 256-bit</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>
              API Gateway: <strong>Hoạt động</strong>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};
