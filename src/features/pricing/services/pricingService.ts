import type { PublicPriceListResponse } from "../types/pricing";

export async function fetchPublicPriceList(signal?: AbortSignal): Promise<PublicPriceListResponse> {
  const res = await fetch("/api/public/price-list", {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || data?.message || "Không thể tải bảng giá sản phẩm.");
  }

  return {
    success: true,
    categories: Array.isArray(data.categories) ? data.categories : [],
    items: Array.isArray(data.items) ? data.items : [],
    total: Number(data.total || 0),
    updated_at: data.updated_at,
  };
}
