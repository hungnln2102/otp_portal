import React, { useState } from "react";
import {
  Film,
  Tv,
  Mail,
  RefreshCw,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  CheckCircle2,
  Wifi,
  ShieldCheck,
} from "lucide-react";
import { NetflixSubForm, HouseholdResult, OtpResult } from "../../../types/otp";
import {
  OTP_OPERATION_ERROR,
  fetchNetflixHousehold,
  fetchNetflixSixDigit,
  fetchNetflixLoginOtp,
} from "../../../services/otpService";
import { OtpPinDisplay } from "../../../components/OtpPinDisplay";
import { OtpEntryWaitBanner } from "../../../components/OtpEntryWaitBanner";

interface NetflixSectionProps {
  activeSubTab?: NetflixSubForm;
  onSubTabChange?: (subTab: NetflixSubForm) => void;
  cooldown: number;
  setCooldown: (seconds: number) => void;
  entryWaitSeconds: number;
  showToast: (type: "success" | "error" | "info", text: string) => void;
  copiedKey: string | null;
  copyToClipboard: (text: string, key: string, label?: string) => void;
}

export const NetflixSection: React.FC<NetflixSectionProps> = ({
  activeSubTab,
  onSubTabChange,
  cooldown,
  setCooldown,
  entryWaitSeconds,
  showToast,
  copiedKey,
  copyToClipboard,
}) => {
  const [localNetflixIndex, setLocalNetflixIndex] = useState<NetflixSubForm>(0); // Default: Hộ gia đình
  const netflixIndex: NetflixSubForm = activeSubTab ?? localNetflixIndex;
  const setNetflixIndex = (next: NetflixSubForm) => {
    setLocalNetflixIndex(next);
    onSubTabChange?.(next);
  };
  const [netflixEmail, setNetflixEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [householdData, setHouseholdData] = useState<HouseholdResult | null>(null);
  const [sixDigitData, setSixDigitData] = useState<string | null>(null);
  const [otpData, setOtpData] = useState<OtpResult | null>(null);
  const isEntryLocked = entryWaitSeconds > 0;

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEntryLocked) return;
    const email = netflixEmail.trim();
    if (!email || !email.includes("@")) {
      showToast("error", "Vui lòng nhập đúng định dạng Email Netflix!");
      return;
    }
    if (cooldown > 0) return;

    try {
      setLoading(true);

      if (netflixIndex === 0) {
        setHouseholdData(null);
        const res = await fetchNetflixHousehold(email);
        const link = res.link || (res as any).data?.link || res.extra_fields?.find((f) => f.key === "netflix_link")?.value;
        const sentTime = res.sent_time || (res as any).data?.sent_time || res.extra_fields?.find((f) => f.key === "sent_time")?.value;

        if ((res.ok || res.success) && link) {
          setHouseholdData({
            link,
            sent_time: sentTime,
            message: res.message || "Đã lấy link xác minh hộ gia đình thành công!",
          });
          setCooldown(30);
          showToast("success", "Đã lấy link xác minh Household thành công!");
        } else {
          setCooldown(15);
          showToast("error", OTP_OPERATION_ERROR);
        }
      } else if (netflixIndex === 1) {
        setSixDigitData(null);
        const res = await fetchNetflixSixDigit(email);
        if ((res.ok || res.success) && res.code) {
          setSixDigitData(res.code);
          setCooldown(30);
          showToast("success", `Đã nhận mã 6 số: ${res.code}`);
        } else {
          setCooldown(15);
          showToast("error", OTP_OPERATION_ERROR);
        }
      } else {
        setOtpData(null);
        const res = await fetchNetflixLoginOtp(email);
        if ((res.ok || res.success) && res.code) {
          setOtpData({
            code: res.code,
            subject: res.subject,
            from: res.from,
            date: res.date,
            message: res.message,
          });
          setCooldown(30);
          showToast("success", `Đã nhận mã OTP Netflix: ${res.code}`);
        } else {
          setCooldown(15);
          showToast("error", OTP_OPERATION_ERROR);
        }
      }
    } catch {
      showToast("error", OTP_OPERATION_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveResult =
    (netflixIndex === 0 && Boolean(householdData)) ||
    (netflixIndex === 1 && Boolean(sixDigitData)) ||
    (netflixIndex === 2 && Boolean(otpData));

  const isHouseholdCopied = copiedKey === "household_link";

  return (
    <div className="text-left space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
        <span className="text-xs font-bold text-[var(--ink)] flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-rose-500" />
          Netflix Premium
        </span>

        {/* Sub tabs Netflix: 0: Hộ gia đình | 1: Mã TV | 2: OTP */}
        <div
          className="flex p-0.5 rounded-lg border border-[var(--line)]"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
        >
          <button
            type="button"
            onClick={() => setNetflixIndex(0)}
            className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
            style={{
              background: netflixIndex === 0 ? "var(--btn)" : "transparent",
              color: netflixIndex === 0 ? "var(--btn-ink)" : "var(--soft)",
              boxShadow: netflixIndex === 0 ? "0 2px 8px var(--glow)" : "none",
            }}
          >
            Hộ Gia Đình
          </button>

          <button
            type="button"
            onClick={() => setNetflixIndex(1)}
            className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
            style={{
              background: netflixIndex === 1 ? "var(--btn)" : "transparent",
              color: netflixIndex === 1 ? "var(--btn-ink)" : "var(--soft)",
              boxShadow: netflixIndex === 1 ? "0 2px 8px var(--glow)" : "none",
            }}
          >
            Mã TV 6 Số
          </button>

          <button
            type="button"
            onClick={() => setNetflixIndex(2)}
            className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
            style={{
              background: netflixIndex === 2 ? "var(--btn)" : "transparent",
              color: netflixIndex === 2 ? "var(--btn-ink)" : "var(--soft)",
              boxShadow: netflixIndex === 2 ? "0 2px 8px var(--glow)" : "none",
            }}
          >
            OTP Đăng Nhập
          </button>
        </div>
      </div>

      <OtpEntryWaitBanner remainingSeconds={entryWaitSeconds} />

      {/* Form Netflix: Tự động thu gọn thành 1 dòng gọn gàng khi đã có kết quả để tránh 2 nút CTA đỏ chồng nhau */}
      <form
        onSubmit={handleAction}
        className={hasActiveResult ? "flex items-center gap-2" : "space-y-3"}
      >
        <div className={hasActiveResult ? "relative flex-1 min-w-0" : "relative"}>
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--soft)]" />
          <input
            type="email"
            required
            disabled={isEntryLocked || loading}
            value={netflixEmail}
            onChange={(e) => setNetflixEmail(e.target.value)}
            placeholder={
              isEntryLocked
                ? `Vui lòng chờ ${entryWaitSeconds}s để nhập Email Netflix...`
                : "Nhập Email tài khoản Netflix..."
            }
            className={`w-full rounded-xl pl-9 pr-3 text-xs text-[var(--ink)] placeholder-[var(--soft)]/50 focus:outline-none transition-all border disabled:opacity-55 disabled:cursor-not-allowed ${
              hasActiveResult
                ? "py-2 border-white/10 focus:border-[var(--accent)]/60"
                : "py-2.5 border-[var(--line)] focus:border-[var(--accent)]"
            }`}
            style={{ background: "rgba(0, 0, 0, 0.45)" }}
          />
        </div>

        {hasActiveResult ? (
          <button
            type="submit"
            disabled={isEntryLocked || loading || cooldown > 0 || !netflixEmail.trim()}
            className="shrink-0 h-[34px] px-3.5 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-semibold text-[var(--ink)] flex items-center gap-1.5 transition-all"
            title="Lấy lại dữ liệu mới nhất"
          >
            {isEntryLocked ? (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="font-mono tabular-nums">{entryWaitSeconds}s</span>
              </>
            ) : loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--accent)] shrink-0" />
                <span>Đang tải...</span>
              </>
            ) : cooldown > 0 ? (
              <>
                <Clock className="w-3.5 h-3.5 text-[var(--soft)] shrink-0" />
                <span className="font-mono tabular-nums">{cooldown}s</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                <span>Lấy lại</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="submit"
            disabled={isEntryLocked || loading || cooldown > 0 || !netflixEmail.trim()}
            className="btn-cta w-full"
            style={{ padding: "10px 16px" }}
          >
            {isEntryLocked ? (
              <>
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Vui lòng chờ {entryWaitSeconds}s</span>
              </>
            ) : loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>Đang kiểm tra máy chủ Netflix...</span>
              </>
            ) : cooldown > 0 ? (
              <>
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Thử lại sau {cooldown}s</span>
              </>
            ) : netflixIndex === 0 ? (
              <>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>Lấy Link Xác Minh Hộ Gia Đình</span>
              </>
            ) : netflixIndex === 1 ? (
              <>
                <Tv className="w-3.5 h-3.5 shrink-0" />
                <span>Lấy Mã TV 6 Số</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Lấy Mã OTP Đăng Nhập</span>
              </>
            )}
          </button>
        )}
      </form>

      {/* Kết Quả Netflix 0: Hộ gia đình */}
      {netflixIndex === 0 && householdData && (
        <div
          className="relative rounded-2xl border border-emerald-500/25 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          style={{
            background:
              "linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(7, 11, 20, 0.72) 38%, rgba(4, 7, 14, 0.84) 100%)",
            boxShadow:
              "0 14px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
          }}
        >
          {/* Top Accent Glow Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />

          <div className="p-4 space-y-3">
            {/* Header Status */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-[13px] font-bold text-white truncate">
                    Link Cập Nhật Netflix Household
                  </div>
                  <div className="text-[10px] text-emerald-300/80 font-medium">
                    Xác minh hộ gia đình • Sẵn sàng sử dụng
                  </div>
                </div>
              </div>

              <span className="shrink-0 inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-400/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                Vừa xong
              </span>
            </div>

            {/* Metadata Strip: Thời gian gửi */}
            {householdData.sent_time && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <span className="text-[11px] text-[var(--soft)] flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  Thời gian gửi
                </span>
                <span className="text-[11px] font-bold text-cyan-200 font-mono tracking-tight">
                  {householdData.sent_time}
                </span>
              </div>
            )}

            {/* Wi-Fi Hint Callout */}
            <div className="flex items-start gap-2.5 px-3 py-2 rounded-xl bg-amber-400/[0.06] border border-amber-400/15">
              <Wifi className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-[11px] text-[var(--soft)] leading-relaxed">
                Nhấn nút <strong className="text-white font-semibold">"Nhận mã"</strong> trên điện thoại hoặc máy tính đang dùng{" "}
                <strong className="text-amber-200 font-semibold">cùng mạng Wi-Fi với TV</strong>.
              </p>
            </div>

            {/* Primary Action Bar */}
            <div className="flex items-center gap-2 pt-0.5">
              <a
                href={householdData.link}
                target="_blank"
                rel="noreferrer"
                className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2 px-4 font-bold text-xs text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99]"
                style={{
                  background: "linear-gradient(135deg, #f40612 0%, #e50914 55%, #b81d24 100%)",
                  boxShadow: "0 8px 22px rgba(229, 9, 20, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
                }}
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>Nhận mã</span>
              </a>

              <button
                type="button"
                onClick={() =>
                  copyToClipboard(householdData.link, "household_link", "Đã sao chép link xác minh!")
                }
                className={`h-10 px-3.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-200 shrink-0 ${
                  isHouseholdCopied
                    ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
                    : "bg-white/[0.06] border-white/15 text-[var(--ink)] hover:bg-white/[0.12]"
                }`}
                title="Sao chép link xác minh"
              >
                {isHouseholdCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                    <span className="hidden sm:inline">Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kết Quả Netflix 1: Mã TV 6 số */}
      {netflixIndex === 1 && sixDigitData && (
        <div
          className="relative rounded-2xl border border-amber-400/25 overflow-hidden text-center animate-in fade-in zoom-in-95 duration-200"
          style={{
            background:
              "linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, rgba(7, 11, 20, 0.72) 40%, rgba(4, 7, 14, 0.84) 100%)",
            boxShadow:
              "0 14px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
          }}
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

          <div className="p-4">
            <div className="flex items-center justify-between gap-2 pb-2">
              <div className="flex items-center gap-2 text-left">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Tv className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Mã TV Xác Minh 6 Số</div>
                  <div className="text-[10px] text-amber-200/75">Nhập mã này lên màn hình TV</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-200 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/25">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Vừa xong
              </span>
            </div>

            <OtpPinDisplay
              code={sixDigitData}
              itemKey="netflix_tv_code"
              copiedKey={copiedKey}
              onCopy={copyToClipboard}
            />
          </div>
        </div>
      )}

      {/* Kết Quả Netflix 2: OTP Đăng Nhập */}
      {netflixIndex === 2 && otpData && (
        <div
          className="relative rounded-2xl border border-emerald-500/25 overflow-hidden text-center animate-in fade-in zoom-in-95 duration-200"
          style={{
            background:
              "linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(7, 11, 20, 0.72) 40%, rgba(4, 7, 14, 0.84) 100%)",
            boxShadow:
              "0 14px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
          }}
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />

          <div className="p-4">
            <div className="flex items-center justify-between gap-2 pb-2">
              <div className="flex items-center gap-2 text-left">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Mã OTP Đăng Nhập</div>
                  <div className="text-[10px] text-emerald-300/80">Xác thực đăng nhập Netflix</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-400/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Vừa xong
              </span>
            </div>

            <OtpPinDisplay
              code={otpData.code}
              itemKey="netflix_login_otp"
              copiedKey={copiedKey}
              onCopy={copyToClipboard}
            />

            {otpData.message && (
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[var(--soft)] mt-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{otpData.message}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
