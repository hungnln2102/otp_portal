import React, { useState, useEffect, useRef } from "react";
import { AccountResult, OrgSwitchResponse } from "../../types/otp";
import { AccountStatusActiveCard } from "./AccountStatusActiveCard";
import { AccountStatusSwitchTeamCard } from "./AccountStatusSwitchTeamCard";
import { AccountStatusNotFoundCard } from "./AccountStatusNotFoundCard";
import {
  OTP_OPERATION_ERROR,
  fetchAdobeSwitchTeam,
  fetchAdobeSwitchTeamStatus,
  type AdobeOrderProof,
} from "../../services/otpService";

interface AccountStatusViewProps {
  data: AccountResult;
  orderProof: AdobeOrderProof;
  copyToClipboard: (text: string, key: string, label?: string) => void;
  showToast: (type: "success" | "error" | "info", text: string) => void;
  onGoOtp?: (account: string) => void;
  onGoAccountLookup?: () => void;
  onStatusUpdated?: (newData: AccountResult) => void;
}

export const AccountStatusView: React.FC<AccountStatusViewProps> = ({
  data,
  orderProof,
  copyToClipboard,
  showToast,
  onGoOtp,
  onGoAccountLookup,
  onStatusUpdated,
}) => {
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchProgress, setSwitchProgress] = useState<OrgSwitchResponse | null>(null);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const switchRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsSwitching(false);
    setSwitchProgress(null);
    setSwitchError(null);
    return () => {
      switchRequestRef.current?.abort();
      switchRequestRef.current = null;
      if (pollTimerRef.current !== null) clearTimeout(pollTimerRef.current);
    };
  }, [data.account, orderProof.code, orderProof.contact]);

  const handleStartSwitchTeam = async () => {
    if (switchRequestRef.current) return;

    const controller = new AbortController();
    switchRequestRef.current = controller;
    const { signal } = controller;
    let pollCount = 0;
    setIsSwitching(true);
    setSwitchError(null);
    setSwitchProgress({ status: "waiting" });

    const finish = (error?: string) => {
      switchRequestRef.current = null;
      setIsSwitching(false);
      if (!error) return;
      setSwitchError(error);
      showToast("error", error);
    };

    const poll = async () => {
      pollTimerRef.current = null;
      pollCount += 1;
      const result = await fetchAdobeSwitchTeamStatus(orderProof, data.account, signal).catch(() => null);
      if (signal.aborted) return;
      if (result?.status?.toLowerCase() === "failed") {
        finish("Chuyển team không thành công.");
        return;
      }
      if (result?.success) {
        setSwitchProgress(result);
        if (result.status === "completed" && result.accountResult?.status_type === "active") {
          finish();
          onStatusUpdated?.(result.accountResult);
          showToast("success", "Đã chuyển team thành công, tài khoản đang hoạt động.");
          return;
        }
      }
      if (pollCount >= 20) {
        finish("Chưa xác minh được kết quả chuyển team. Hãy kiểm tra lại trạng thái tài khoản.");
        return;
      }
      pollTimerRef.current = setTimeout(poll, 3500);
    };

    const result = await fetchAdobeSwitchTeam(orderProof, data.account, signal).catch(() => null);
    if (signal.aborted) return;
    if (result?.status?.toLowerCase() === "failed") {
      finish("Chuyển team không thành công.");
      return;
    }
    if (!result?.success) {
      finish(OTP_OPERATION_ERROR);
      return;
    }
    setSwitchProgress(result);
    showToast("info", "Đã gửi yêu cầu đổi team, hệ thống đang xử lý...");
    pollTimerRef.current = setTimeout(poll, 3500);
  };

  // Xác định form hiển thị dựa trên status_type
  const statusType = data.status_type || (
    data.status === "KHÔNG TỒN TẠI" ? "not_found" :
    data.status === "CẦN CHUYỂN TEAM" ? "inactive" : "active"
  );

  if (statusType === "inactive") {
    return (
      <AccountStatusSwitchTeamCard
        data={data}
        isSwitching={isSwitching}
        switchProgress={switchProgress}
        switchError={switchError}
        onSwitchTeam={handleStartSwitchTeam}
        copyToClipboard={copyToClipboard}
      />
    );
  }

  if (statusType === "not_found") {
    return (
      <AccountStatusNotFoundCard
        data={data}
        copyToClipboard={copyToClipboard}
        onGoAccountLookup={onGoAccountLookup}
      />
    );
  }

  return (
    <AccountStatusActiveCard
      data={data}
      copyToClipboard={copyToClipboard}
      onGoOtp={onGoOtp}
    />
  );
};

