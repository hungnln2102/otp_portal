import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPublicPriceList } from "../services/pricingService";
import type { PublicPriceCategory, PublicPriceItem } from "../types/pricing";

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim();
}

export function usePublicPriceList() {
  const [items, setItems] = useState<PublicPriceItem[]>([]);
  const [categories, setCategories] = useState<PublicPriceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const loadPriceList = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublicPriceList(signal);
      setItems(data.items);
      setCategories(data.categories);
      setUpdatedAt(data.updated_at || null);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setError(err?.message || "Không thể tải bảng giá. Vui lòng thử lại sau.");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadPriceList(controller.signal);
    return () => controller.abort();
  }, [loadPriceList]);

  const filteredItems = useMemo(() => {
    const q = normalizeSearchText(searchQuery);
    return items.filter((item) => {
      if (selectedCategory !== "all" && item.category_slug !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const haystack = normalizeSearchText(
        `${item.product_name} ${item.variant_name} ${item.duration} ${item.desc} ${item.category}`
      );
      return haystack.includes(q);
    });
  }, [items, selectedCategory, searchQuery]);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategory === "all") return "Tất cả sản phẩm";
    return categories.find((c) => c.slug === selectedCategory)?.name || "Danh mục";
  }, [categories, selectedCategory]);

  const resetFilters = useCallback(() => {
    setSelectedCategory("all");
    setSearchQuery("");
  }, []);

  return {
    items,
    filteredItems,
    categories,
    selectedCategory,
    selectedCategoryName,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    updatedAt,
    refresh: () => void loadPriceList(),
    resetFilters,
  };
}
