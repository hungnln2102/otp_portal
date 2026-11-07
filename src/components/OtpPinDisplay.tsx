import React from "react";
import { Check, Copy } from "lucide-react";

interface OtpPinDisplayProps {
  code: string;
  copiedKey: string | null;
  itemKey: string;
  onCopy: (code: string, key: string, label?: string) => void;
}

export const OtpPinDisplay: React.FC<OtpPinDisplayProps> = ({
  code,
  copiedKey,
  itemKey,
  onCopy,
}) => {
  const digits = code.trim().split("");
  const isCopied = copiedKey === itemKey;

  return (
    <div className="space-y-2.5 my-2 animate-in fade-in zoom-in-95 duration-200">
      <div
        className="otp-container"
        onClick={() => onCopy(code, itemKey, `Đã sao chép mã ${code}!`)}
        title="Bấm vào để sao chép mã ngay"
      >
        {digits.map((d, i) => (
          <div key={i} className="otp-digit">
            {d}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onCopy(code, itemKey, `Đã sao chép mã ${code}!`)}
        className="btn-cta"
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4 text-current shrink-0" />
            <span>ĐÃ SAO CHÉP MÃ ({code})!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-current shrink-0" />
            <span>SAO CHÉP MÃ XÁC THỰC ({code})</span>
          </>
        )}
      </button>
    </div>
  );
};

