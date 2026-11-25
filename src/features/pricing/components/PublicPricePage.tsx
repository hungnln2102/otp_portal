import React from "react";
import { Search, X, RefreshCw, AlertCircle, Tag } from "lucide-react";
import { usePublicPriceList } from "../hooks/usePublicPriceList";
import { PricingCategorySidebar } from "./PricingCategorySidebar";
import { PricingTable } from "./PricingTable";

export const PublicPricePage: React.FC = () => {
  const {
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
    refresh,
    resetFilters,
  } = usePublicPriceList();

  const hasActiveFilters = selectedCategory !== "all" || searchQuery.trim().length > 0;

  return (
    <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 relative z-10 flex flex-col gap-3 overflow-hidden">
      {/* Thanh tiêu đề & tìm kiếm nhanh */}
      <section
        className="rounded-2xl border border-[var(--line)] backdrop-blur-2xl px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0"
        style={{
          background: "var(--panel)",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-[var(--line)]"
            style={{
              background: "var(--btn)",
              color: "var(--btn-ink)",
              boxShadow: "0 4px 14px var(--glow)",
            }}
          >
            <Tag className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-[var(--ink)]">
                Bảng Giá Dịch Vụ Mavryk Premium
              </h1>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--line)]"
                style={{ background: "rgba(255,255,255,0.06)", color: "var(--accent)" }}
              >
                {filteredItems.length} gói
              </span>
            </div>
            <p className="text-[11px] text-[var(--soft)] truncate">
              Đang xem: <strong className="text-[var(--ink)]">{selectedCategoryName}</strong> • Giá niêm yết công khai cập nhật trực tiếp từ hệ thống
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-[var(--soft)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm sản phẩm, gói, mô tả..."
              aria-label="Tìm kiếm trong bảng giá"
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-black/45 border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--soft)] placeholder:opacity-60 focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Xóa từ khóa tìm kiếm"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--soft)] hover:text-[var(--ink)] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            title="Tải lại bảng giá"
            className="p-2 rounded-xl border border-[var(--line)] text-[var(--ink)] hover:brightness-125 transition-all disabled:opacity-50 shrink-0"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <RefreshCw className={`w-4 h-4 text-[var(--accent)] ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </section>

      {/* Khu vực nội dung chính: Sidebar Danh mục bên trái + Bảng giá 4 cột bên phải */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 sm:gap-4 overflow-hidden">
        <PricingCategorySidebar
          categories={categories}
          totalCount={items.length}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          loading={loading}
        />

        <section
          className="flex-1 min-h-0 rounded-2xl border border-[var(--line)] backdrop-blur-2xl flex flex-col overflow-hidden"
          style={{
            background: "var(--panel)",
            boxShadow: "0 20px 55px rgba(0, 0, 0, 0.65), 0 0 28px var(--glow)",
          }}
        >
          {error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-rose-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[var(--ink)]">{error}</p>
                <p className="text-xs text-[var(--soft)]">
                  Vui lòng kiểm tra kết nối và thử tải lại bảng giá.
                </p>
              </div>
              <button
                type="button"
                onClick={refresh}
                className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background: "var(--btn)", color: "var(--btn-ink)" }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
            </div>
          ) : (
            <PricingTable
              items={filteredItems}
              loading={loading}
              onResetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}

          {/* Footer gọn trong bảng giá */}
          <div className="px-4 py-2.5 border-t border-[var(--line)] flex items-center justify-between text-[10px] text-[var(--soft)] shrink-0">
            <span>© 2026 Mavryk Premium • Bảng giá chính thức</span>
            <span>
              Hiển thị <strong className="text-[var(--ink)]">{filteredItems.length}</strong> /{" "}
              {items.length} gói dịch vụ
            </span>
          </div>
        </section>
      </div>
    </main>
  );
};
