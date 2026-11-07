import { AccountResult } from "../types/otp";

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

export async function fetchAdobeOtp(email: string): Promise<ApiResponse & { otp?: string; duration_ms?: number }> {
  const res = await fetch("/api/public/otp/adobe/code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });
  return res.json();
}

export async function fetchNetflixHousehold(email: string): Promise<ApiResponse & { link?: string }> {
  const res = await fetch("/api/public/otp/netflix/household", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });
  return res.json();
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
