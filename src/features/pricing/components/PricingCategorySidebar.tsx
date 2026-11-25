import React from "react";
import {
  LayoutGrid,
  Bot,
  Palette,
  Film,
  Tv,
  GraduationCap,
  ShieldCheck,
  Tag,
} from "lucide-react";
import type { PublicPriceCategory } from "../types/pricing";

interface PricingCategorySidebarProps {
  categories: PublicPriceCategory[];
  totalCount: number;
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  loading?: boolean;
}

function getCategoryIcon(slug: string) {
  if (slug.includes("ai") || slug.includes("tro-ly")) return Bot;
  if (slug.includes("thiet-ke") || slug.includes("do-hoa")) return Palette;
  if (slug.includes("video") || slug.includes("am-thanh")) return Film;
  if (slug.includes("giai-tri") || slug.includes("streaming")) return Tv;
  if (slug.includes("hoc-tap") || slug.includes("van-phong")) return GraduationCap;
  if (slug.includes("bao-mat") || slug.includes("tien-ich")) return ShieldCheck;
  return Tag;
}

export const PricingCategorySidebar: React.FC<PricingCategorySidebarProps> = ({
  categories,
  totalCount,
  selectedCategory,
  onSelectCategory,
  loading = false,
}) => {
  const allActive = selectedCategory === "all";

  return (
    <>
      {/* Mobile / Tablet: Thanh danh mục cuộn ngang gọn gàng */}
      <nav
        aria-label="Danh mục sản phẩm"
        className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 shrink-0"
      >
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all"
          style={{
            background: allActive ? "var(--btn)" : "var(--panel)",
            color: allActive ? "var(--btn-ink)" : "var(--ink)",
            borderColor: allActive ? "transparent" : "var(--line)",
            boxShadow: allActive ? "0 4px 14px var(--glow)" : "none",
          }}
        >
          <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
          <span>Tất cả</span>
          <span className="text-[10px] opacity-80">({totalCount})</span>
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          const Icon = getCategoryIcon(cat.slug);
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all"
              style={{
                background: isActive ? "var(--btn)" : "var(--panel)",
                color: isActive ? "var(--btn-ink)" : "var(--ink)",
                borderColor: isActive ? "transparent" : "var(--line)",
                boxShadow: isActive ? "0 4px 14px var(--glow)" : "none",
              }}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-80">({cat.count})</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop: Menu Bar danh mục cố định cạnh bên trái */}
      <aside
        aria-label="Danh mục bảng giá"
        className="hidden lg:flex lg:flex-col w-64 shrink-0 rounded-2xl border border-[var(--line)] backdrop-blur-2xl overflow-hidden"
        style={{
          background: "var(--panel)",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.55)",
        }}
      >
        <div className="px-4 py-3.5 border-b border-[var(--line)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink)]">
              Danh Mục
            </span>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--line)]"
            style={{ background: "rgba(255, 255, 255, 0.06)", color: "var(--accent)" }}
          >
            {categories.length} nhóm
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left"
            style={{
              background: allActive ? "var(--btn)" : "transparent",
              color: allActive ? "var(--btn-ink)" : "var(--ink)",
              boxShadow: allActive ? "0 4px 14px var(--glow)" : "none",
            }}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <LayoutGrid className="w-4 h-4 shrink-0 opacity-90" />
              <span className="truncate">Tất cả sản phẩm</span>
            </span>
            <span
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: allActive ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.08)",
                color: allActive ? "var(--btn-ink)" : "var(--soft)",
              }}
            >
              {totalCount}
            </span>
          </button>

          {loading && categories.length === 0 ? (
            <div className="space-y-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="h-9 rounded-xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              const Icon = getCategoryIcon(cat.slug);
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left hover:bg-white/5"
                  style={{
                    background: isActive ? "var(--btn)" : undefined,
                    color: isActive ? "var(--btn-ink)" : "var(--ink)",
                    boxShadow: isActive ? "0 4px 14px var(--glow)" : "none",
                  }}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className="w-4 h-4 shrink-0"
                      style={{ color: isActive ? "var(--btn-ink)" : "var(--accent)" }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: isActive ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.07)",
                      color: isActive ? "var(--btn-ink)" : "var(--soft)",
                    }}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
};
