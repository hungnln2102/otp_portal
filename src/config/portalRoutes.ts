import { useCallback, useEffect, useRef, useState } from "react";
import type { MainTab } from "../types/otp";

export type PortalRouteKey =
  | "adobe_account"
  | "adobe_otp"
  | "netflix_household"
  | "netflix_tv"
  | "netflix_otp"
  | "gpt_account"
  | "gpt_otp"
  | "two_factor";

export interface PortalRouteEntry {
  key: PortalRouteKey;
  slug: string;
  tab: MainTab;
  subTab: number;
}

export interface PortalUrlsConfig {
  basePath: string;
  defaultRouteKey: PortalRouteKey;
  routes: Record<PortalRouteKey, PortalRouteEntry>;
}

const STORAGE_KEY = "mavryk_portal_urls_v1";

function resolveBasePath(): string {
  const raw = ((import.meta as any).env?.BASE_URL as string) || "/system/";
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed || "/system";
}

export const PORTAL_BASE_PATH = resolveBasePath();
export const HOME_PAGE_PATH = "/";
export const PRICE_PAGE_PATH = "/price";

export type PortalPageMode = "home" | "system" | "price";

export function isHomePathname(pathname: string): boolean {
  const clean = pathname.replace(/\/+/g, "/");
  return clean === "" || clean === "/";
}

export function isPricePathname(pathname: string): boolean {
  const clean = pathname.replace(/\/+/g, "/").replace(/\/+$/, "").toLowerCase();
  const cleanBase = PORTAL_BASE_PATH.replace(/\/+$/, "").toLowerCase();
  return clean === PRICE_PAGE_PATH || clean === `${cleanBase}${PRICE_PAGE_PATH}`;
}

export function resolvePageMode(pathname: string): PortalPageMode {
  if (isHomePathname(pathname)) return "home";
  if (isPricePathname(pathname)) return "price";
  return "system";
}

export const DEFAULT_PORTAL_URLS: PortalUrlsConfig = {
  basePath: PORTAL_BASE_PATH,
  defaultRouteKey: "adobe_otp",
  routes: {
    adobe_account: { key: "adobe_account", slug: "adobe-account", tab: "adobe", subTab: 1 },
    adobe_otp: { key: "adobe_otp", slug: "adobe-otp", tab: "adobe", subTab: 2 },
    netflix_household: { key: "netflix_household", slug: "netflix-household", tab: "netflix", subTab: 0 },
    netflix_tv: { key: "netflix_tv", slug: "netflix-tv", tab: "netflix", subTab: 1 },
    netflix_otp: { key: "netflix_otp", slug: "netflix-otp", tab: "netflix", subTab: 2 },
    gpt_account: { key: "gpt_account", slug: "gpt-account", tab: "gpt", subTab: 0 },
    gpt_otp: { key: "gpt_otp", slug: "gpt-otp", tab: "gpt", subTab: 1 },
    two_factor: { key: "two_factor", slug: "2fa", tab: "two_factor", subTab: 0 },
  },
};

const DEFAULT_SUBTAB_BY_TAB: Record<MainTab, number> = {
  adobe: 2,
  netflix: 0,
  gpt: 1,
  two_factor: 0,
};

function sanitizeSlug(value: unknown, fallback: string): string {
  const cleaned = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleaned) ? cleaned : fallback;
}

export function normalizePortalUrlsConfig(raw: any): PortalUrlsConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_PORTAL_URLS;
  const incomingRoutes = raw.routes && typeof raw.routes === "object" ? raw.routes : {};
  const merged = {} as Record<PortalRouteKey, PortalRouteEntry>;
  const usedSlugs = new Set<string>();

  for (const key of Object.keys(DEFAULT_PORTAL_URLS.routes) as PortalRouteKey[]) {
    const def = DEFAULT_PORTAL_URLS.routes[key];
    const entry = incomingRoutes[key];
    const candidate = sanitizeSlug(
      typeof entry === "string" ? entry : entry?.slug,
      def.slug
    );
    const slug = usedSlugs.has(candidate) ? def.slug : candidate;
    usedSlugs.add(slug);
    merged[key] = { ...def, slug };
  }

  const defaultRouteKey: PortalRouteKey =
    raw.defaultRouteKey && raw.defaultRouteKey in merged
      ? (raw.defaultRouteKey as PortalRouteKey)
      : DEFAULT_PORTAL_URLS.defaultRouteKey;

  return {
    basePath: PORTAL_BASE_PATH,
    defaultRouteKey,
    routes: merged,
  };
}

function readCachedPortalUrls(): PortalUrlsConfig {
  try {
    if (typeof window === "undefined") return DEFAULT_PORTAL_URLS;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PORTAL_URLS;
    return normalizePortalUrlsConfig(JSON.parse(raw));
  } catch {
    return DEFAULT_PORTAL_URLS;
  }
}

export async function fetchRemotePortalUrls(): Promise<PortalUrlsConfig | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch("/api/public/portal-urls", {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.success || !data?.config) return null;
    const normalized = normalizePortalUrlsConfig(data.config);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch {}
    return normalized;
  } catch {
    return null;
  }
}

function extractSlugFromPathname(pathname: string, basePath: string): string {
  const cleanPath = pathname.replace(/\/+/g, "/").replace(/\/+$/, "");
  const cleanBase = basePath.replace(/\/+$/, "");

  if (!cleanPath || cleanPath === "/" || cleanPath === cleanBase) {
    return "";
  }
  if (cleanPath.startsWith(`${cleanBase}/`)) {
    return cleanPath.slice(cleanBase.length + 1).split("/")[0].toLowerCase();
  }
  // Tương thích cả trường hợp mở từ legacy /otp/<slug>
  if (cleanPath.startsWith("/otp/")) {
    return cleanPath.slice("/otp/".length).split("/")[0].toLowerCase();
  }
  return cleanPath.replace(/^\/+/, "").split("/")[0].toLowerCase();
}

export function matchRouteByPathname(
  pathname: string,
  config: PortalUrlsConfig
): PortalRouteEntry | null {
  const slug = extractSlugFromPathname(pathname, config.basePath);
  if (!slug) return null;
  return Object.values(config.routes).find((entry) => entry.slug === slug) || null;
}

export function findRouteByTab(
  tab: MainTab,
  subTab: number | undefined,
  config: PortalUrlsConfig
): PortalRouteEntry {
  const targetSub = subTab ?? DEFAULT_SUBTAB_BY_TAB[tab];
  return (
    Object.values(config.routes).find(
      (entry) => entry.tab === tab && entry.subTab === targetSub
    ) ||
    Object.values(config.routes).find((entry) => entry.tab === tab) ||
    config.routes[config.defaultRouteKey]
  );
}

export function buildPortalRouteUrl(
  entry: PortalRouteEntry,
  config: PortalUrlsConfig,
  search = "",
  hash = ""
): string {
  const cleanBase = config.basePath.replace(/\/+$/, "");
  return `${cleanBase}/${entry.slug}${search}${hash}`;
}

export function usePortalRoute() {
  const [config, setConfig] = useState<PortalUrlsConfig>(() => readCachedPortalUrls());
  const configRef = useRef<PortalUrlsConfig>(config);
  configRef.current = config;

  const [pageMode, setPageMode] = useState<PortalPageMode>(() =>
    typeof window !== "undefined" ? resolvePageMode(window.location.pathname) : "home"
  );

  const initialMatched =
    typeof window !== "undefined" && resolvePageMode(window.location.pathname) === "system"
      ? matchRouteByPathname(window.location.pathname, config)
      : null;

  const [currentRoute, setCurrentRoute] = useState<PortalRouteEntry>(
    () => initialMatched || config.routes[config.defaultRouteKey]
  );

  // Ghi nhớ subTab gần nhất của mỗi tab để chuyển qua lại tự nhiên
  const lastSubTabRef = useRef<Record<MainTab, number>>({
    ...DEFAULT_SUBTAB_BY_TAB,
    [currentRoute.tab]: currentRoute.subTab,
  });

  const syncBrowserUrl = useCallback(
    (entry: PortalRouteEntry, cfg: PortalUrlsConfig, replace = false) => {
      if (typeof window === "undefined") return;
      const target = buildPortalRouteUrl(
        entry,
        cfg,
        window.location.search,
        window.location.hash
      );
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (current === target) return;
      if (replace) {
        window.history.replaceState({ routeKey: entry.key }, "", target);
      } else {
        window.history.pushState({ routeKey: entry.key }, "", target);
      }
    },
    []
  );

  // Đồng bộ cấu hình URL mới nhất từ backend admin_orderlist
  useEffect(() => {
    let active = true;
    fetchRemotePortalUrls().then((remote) => {
      if (!active) return;
      const effectiveConfig = remote || configRef.current;
      if (remote) {
        setConfig(remote);
        configRef.current = remote;
      }

      if (typeof window === "undefined") return;
      const pathname = window.location.pathname;
      if (isHomePathname(pathname)) {
        setPageMode("home");
        return;
      }
      if (isPricePathname(pathname)) {
        setPageMode("price");
        const canonical = `${PRICE_PAGE_PATH}${window.location.search}${window.location.hash}`;
        const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (current !== canonical) {
          window.history.replaceState({ routeKey: "price" }, "", canonical);
        }
        return;
      }

      setPageMode("system");
      const matched = matchRouteByPathname(pathname, effectiveConfig);
      if (matched) {
        lastSubTabRef.current[matched.tab] = matched.subTab;
        setCurrentRoute(matched);
        syncBrowserUrl(matched, effectiveConfig, true);
      } else {
        const fallback = effectiveConfig.routes[effectiveConfig.defaultRouteKey];
        lastSubTabRef.current[fallback.tab] = fallback.subTab;
        setCurrentRoute(fallback);
        syncBrowserUrl(fallback, effectiveConfig, true);
      }
    });
    return () => {
      active = false;
    };
  }, [syncBrowserUrl]);

  // Hỗ trợ Back / Forward trình duyệt
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (isHomePathname(pathname)) {
        setPageMode("home");
        return;
      }
      if (isPricePathname(pathname)) {
        setPageMode("price");
        return;
      }
      setPageMode("system");
      const cfg = configRef.current;
      const matched =
        matchRouteByPathname(pathname, cfg) ||
        cfg.routes[cfg.defaultRouteKey];
      lastSubTabRef.current[matched.tab] = matched.subTab;
      setCurrentRoute(matched);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToHome = useCallback(() => {
    setPageMode("home");
    if (typeof window === "undefined") return;
    const target = `${HOME_PAGE_PATH}${window.location.search}${window.location.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current !== target) {
      window.history.pushState({ routeKey: "home" }, "", target);
    }
  }, []);

  const navigateToPrice = useCallback(() => {
    setPageMode("price");
    if (typeof window === "undefined") return;
    const target = `${PRICE_PAGE_PATH}${window.location.search}${window.location.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current !== target) {
      window.history.pushState({ routeKey: "price" }, "", target);
    }
  }, []);

  const navigateToTab = useCallback(
    (tab: MainTab, subTab?: number) => {
      const cfg = configRef.current;
      const resolvedSubTab = subTab ?? lastSubTabRef.current[tab];
      const next = findRouteByTab(tab, resolvedSubTab, cfg);
      lastSubTabRef.current[next.tab] = next.subTab;
      setPageMode("system");
      setCurrentRoute(next);
      syncBrowserUrl(next, cfg, false);
    },
    [syncBrowserUrl]
  );

  const navigateToSubTab = useCallback(
    (tab: MainTab, subTab: number) => {
      navigateToTab(tab, subTab);
    },
    [navigateToTab]
  );

  return {
    config,
    pageMode,
    isPricePage: pageMode === "price",
    activeTab: currentRoute.tab,
    activeSubTab: currentRoute.subTab,
    currentRoute,
    navigateToHome,
    navigateToPrice,
    navigateToTab,
    navigateToSubTab,
  };
}
