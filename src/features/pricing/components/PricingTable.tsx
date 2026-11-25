import React, { useMemo, useState } from "react";
import { PackageSearch, RotateCcw, Clock } from "lucide-react";
import type { PublicPriceItem } from "../types/pricing";

interface PricingTableProps {
  items: PublicPriceItem[];
  loading: boolean;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

interface RowSpanMeta {
  item: PublicPriceItem;
  productRowSpan: number; // > 0: render ô Product với rowSpan này; 0: bỏ qua vì đã gộp
  variantRowSpan: number; // > 0: render ô variant_name với rowSpan này; 0: bỏ qua vì đã gộp
  isProductEnd: boolean;  // Dòng cuối cùng của khối Product để kẻ phân tách rõ
  isVariantEnd: boolean;  // Dòng cuối cùng của khối Variant trong Product
  variantEndsProduct: boolean; // Nhóm Variant này chạm đáy khối Product
}

function formatPriceVnd(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "Liên hệ";
  return `${new Intl.NumberFormat("vi-VN").format(Math.round(value))} ₫`;
}

function getInitials(name: string): string {
  const parts = String(name || "M")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "M";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getVariantGroupKey(item: PublicPriceItem): string {
  const grp = (item.variant_group || item.variant_name || String(item.id))
    .trim()
    .toLowerCase();
  return `${item.product_id}::${grp}`;
}

/**
 * Tính rowSpan cho cột Product (theo product_id liên tiếp)
 * và cột variant_name (theo product_id + variant_group liên tiếp).
 */
function buildRowSpanMeta(items: PublicPriceItem[]): RowSpanMeta[] {
  const rows: RowSpanMeta[] = items.map((item) => ({
    item,
    productRowSpan: 0,
    variantRowSpan: 0,
    isProductEnd: false,
    isVariantEnd: false,
    variantEndsProduct: false,
  }));

  let pStart = 0;
  while (pStart < items.length) {
    const prodId = items[pStart].product_id;
    let pEnd = pStart;
    while (pEnd + 1 < items.length && items[pEnd + 1].product_id === prodId) {
      pEnd += 1;
    }
    rows[pStart].productRowSpan = pEnd - pStart + 1;
    rows[pEnd].isProductEnd = true;

    let vStart = pStart;
    while (vStart <= pEnd) {
      const vKey = getVariantGroupKey(items[vStart]);
      let vEnd = vStart;
      while (vEnd + 1 <= pEnd && getVariantGroupKey(items[vEnd + 1]) === vKey) {
        vEnd += 1;
      }
      rows[vStart].variantRowSpan = vEnd - vStart + 1;
      rows[vStart].variantEndsProduct = vEnd === pEnd;
      rows[vEnd].isVariantEnd = true;
      vStart = vEnd + 1;
    }

    pStart = pEnd + 1;
  }

  return rows;
}

const ProductAvatar: React.FC<{ name: string; imageUrl: string | null }> = ({
  name,
  imageUrl,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imageUrl || imgFailed) {
    return (
      <div
        className="w-11 h-11 rounded-xl border border-[var(--line)] flex items-center justify-center font-extrabold text-xs shrink-0 select-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(0,0,0,0.45))",
          color: "var(--accent)",
        }}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className="w-11 h-11 rounded-xl border border-[var(--line)] overflow-hidden bg-black/40 shrink-0">
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setImgFailed(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const PricingTable: React.FC<PricingTableProps> = ({
  items,
  loading,
  onResetFilters,
  hasActiveFilters,
}) => {
  const rows = useMemo(() => buildRowSpanMeta(items), [items]);

  if (loading && items.length === 0) {
    return (
      <div className="p-4 sm:p-5 space-y-2.5">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="h-16 rounded-xl bg-white/[0.04] border border-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-10 gap-3">
        <div
          className="w-14 h-14 rounded-2xl border border-[var(--line)] flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <PackageSearch className="w-7 h-7 text-[var(--accent)]" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-[var(--ink)]">
            Không tìm thấy sản phẩm phù hợp
          </p>
          <p className="text-xs text-[var(--soft)]">
            Thử đổi danh mục hoặc tìm với từ khóa khác.
          </p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background: "var(--btn)",
              color: "var(--btn-ink)",
              boxShadow: "0 4px 14px var(--glow)",
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xem tất cả sản phẩm</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <table className="w-full text-left border-collapse min-w-[820px]">
        <thead className="sticky top-0 z-10 backdrop-blur-xl">
          <tr
            className="border-b border-[var(--line)] text-[11px] font-extrabold uppercase tracking-wider text-[var(--soft)]"
            style={{ background: "rgba(7, 11, 20, 0.94)" }}
          >
            <th className="py-3.5 px-4 w-[22%] border-r border-white/[0.06]">Product + Hình ảnh</th>
            <th className="py-3.5 px-4 w-[20%] border-r border-white/[0.06]">variant_name</th>
            <th className="py-3.5 px-4 w-[12%] border-r border-white/[0.06] text-center">Thời hạn</th>
            <th className="py-3.5 px-4 w-[22%] border-r border-white/[0.06]">desc</th>
            <th className="py-3.5 px-4 w-[12%] border-r border-white/[0.06] text-right">Price</th>
            <th className="py-3.5 px-4 w-[12%] text-right">Khuyến mãi</th>
          </tr>
        </thead>

        <tbody className="text-xs sm:text-[13px]">
          {rows.map(({ item, productRowSpan, variantRowSpan, isProductEnd, isVariantEnd, variantEndsProduct }) => {
            const hasPromo =
              item.promo_price !== null && item.promo_price > 0;
            const discountPct =
              hasPromo && item.promo_price && item.price > item.promo_price
                ? Math.round(((item.price - item.promo_price) / item.price) * 100)
                : 0;

            const rowBorderClass = isProductEnd
              ? "border-b-2 border-[var(--line)]"
              : isVariantEnd
              ? "border-b border-white/[0.12]"
              : "border-b border-white/[0.05]";

            return (
              <tr
                key={item.id}
                className="transition-colors hover:bg-white/[0.03]"
              >
                {/* Cột 1: Product + Hình ảnh (gộp theo product_id) */}
                {productRowSpan > 0 && (
                  <td
                    rowSpan={productRowSpan}
                    className="py-3.5 px-4 align-middle border-r border-white/[0.06] border-b-2 border-b-[var(--line)] bg-white/[0.015]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ProductAvatar
                        name={item.product_name}
                        imageUrl={item.image_url}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-[var(--ink)] truncate">
                          {item.product_name}
                        </div>
                        <span
                          className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/10 text-[var(--soft)]"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        >
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </td>
                )}

                {/* Cột 2: variant_name (gộp theo đoạn đầu --xm trong cùng Product) */}
                {variantRowSpan > 0 && (
                  <td
                    rowSpan={variantRowSpan}
                    className={`py-3 px-4 align-middle border-r border-white/[0.06] ${
                      variantEndsProduct
                        ? "border-b-2 border-b-[var(--line)]"
                        : "border-b border-b-white/[0.12]"
                    }`}
                  >
                    <span className="font-semibold text-[var(--ink)] leading-snug block">
                      {item.variant_name}
                    </span>
                  </td>
                )}

                {/* Cột 3: Thời hạn (phân giải --xm -> số tháng) */}
                <td className={`py-3 px-4 align-middle text-center whitespace-nowrap border-r border-white/[0.06] ${rowBorderClass}`}>
                  {item.duration ? (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-[var(--line)] text-[var(--ink)]"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <Clock className="w-3 h-3 text-[var(--accent)] shrink-0" />
                      <span>{item.duration}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--soft)] opacity-50">—</span>
                  )}
                </td>

                {/* Cột 4: desc */}
                <td className={`py-3 px-4 align-middle border-r border-white/[0.06] ${rowBorderClass}`}>
                  {item.desc ? (
                    <p className="text-xs text-[var(--soft)] leading-relaxed whitespace-pre-line">
                      {item.desc}
                    </p>
                  ) : (
                    <span className="text-xs text-[var(--soft)] opacity-45">—</span>
                  )}
                </td>

                {/* Cột 5: Price (Giá bán lẻ niêm yết) */}
                <td className={`py-3 px-4 align-middle text-right whitespace-nowrap border-r border-white/[0.06] ${rowBorderClass}`}>
                  <span
                    className={`font-extrabold tabular-nums ${
                      hasPromo
                        ? "text-xs text-[var(--soft)] line-through opacity-75"
                        : "text-sm sm:text-[15px]"
                    }`}
                    style={hasPromo ? undefined : { color: "var(--accent)" }}
                  >
                    {formatPriceVnd(item.price)}
                  </span>
                </td>

                {/* Cột 6: Khuyến mãi */}
                <td className={`py-3 px-4 align-middle text-right whitespace-nowrap ${rowBorderClass}`}>
                  {hasPromo && item.promo_price ? (
                    <div className="inline-flex flex-col items-end gap-0.5">
                      <span className="font-extrabold text-sm sm:text-[15px] text-emerald-400 tabular-nums">
                        {formatPriceVnd(item.promo_price)}
                      </span>
                      {discountPct > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          -{discountPct}%
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--soft)] opacity-40">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
