import { AccountResult, OrgSwitchResponse } from "../types/otp";

export const OTP_OPERATION_ERROR = "Vui lòng liên hệ admin.";

export interface ApiResponse<T = any> {
  success?: boolean;
  ok?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function fetchAdobeAccount(search: string): Promise<ApiResponse<AccountResult>> {
  const res = await fetch("/api/public/otp/adobe/account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ search: search.trim() }),
  });
  return res.json();
}

export async function fetchAdobeCheck(email: string): Promise<ApiResponse<AccountResult>> {
  const res = await fetch("/api/public/otp/adobe/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), search: email.trim(), input: email.trim() }),
  });
  return res.json();
}

export interface AdobeOrderProof {
  code: string;
  contact: string;
}

export async function fetchAdobeSwitchTeam(
  proof: AdobeOrderProof,
  email: string,
): Promise<ApiResponse<OrgSwitchResponse>> {
  const res = await fetch("/api/public/otp/adobe/switch-team", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...proof, email: email.trim() }),
  });
  return res.json();
}

export async function fetchAdobeSwitchTeamStatus(
  proof: AdobeOrderProof,
  email: string,
): Promise<ApiResponse<OrgSwitchResponse>> {
  const res = await fetch("/api/public/otp/adobe/switch-team/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...proof, email: email.trim() }),
  });
  return res.json();
}

export async function fetchAdobeOtp(email: string): Promise<ApiResponse & { otp?: string; duration_ms?: number }> {
  const res = await fetch("/api/public/otp/adobe/code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });
  return res.json();
}

export async function fetchNetflixHousehold(
  email: string
): Promise<ApiResponse & { link?: string; sent_time?: string; extra_fields?: Array<{ key: string; value: string; label: string }> }> {
  const res = await fetch("/api/public/otp/netflix/household", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });
  const data = await res.json();
  const link = data.link || data.data?.link || data.extra_fields?.find((f: any) => f.key === "netflix_link")?.value || null;
  const sent_time = data.sent_time || data.data?.sent_time || data.extra_fields?.find((f: any) => f.key === "sent_time")?.value || null;
  return {
    ...data,
    link,
    sent_time,
  };
}

export async function fetchNetflixSixDigit(email: string): Promise<ApiResponse & { code?: string }> {
  const res = await fetch("/api/public/otp/netflix/six-digit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });
  return res.json();
}

export async function fetchNetflixLoginOtp(
  email: string
): Promise<ApiResponse & { code?: string; subject?: string; from?: string; date?: string }> {
  const res = await fetch("/api/public/otp/netflix/login-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });
  return res.json();
}

export async function fetchGptAccount(search: string): Promise<ApiResponse<AccountResult>> {
  const res = await fetch("/api/public/otp/gpt/account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ search: search.trim() }),
  });
  return res.json();
}

export async function fetchGptOtp(
  email: string
): Promise<ApiResponse & { code?: string; otp?: string; duration_ms?: number }> {
  const res = await fetch("/api/public/otp/gpt/code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });
  if (!res.ok) return { success: false };
  return res.json();
}

import { PORTAL_SLOTS_REGISTRY, PortalSlotDefinition } from "../config/portalSlotsRegistry";

/**
 * Lấy danh sách slots đang hoạt động từ Backend (đã qua cấu hình bật/tắt của Admin)
 */
export async function fetchActivePortalSlots(): Promise<PortalSlotDefinition[]> {
  try {
    const res = await fetch("/api/public/otp-portal-slots");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.slots) && data.slots.length > 0) {
        return data.slots;
      }
    }
  } catch (err) {
    console.warn("[PortalSlots] Dùng registry nội bộ:", err);
  }
  return PORTAL_SLOTS_REGISTRY;
}
