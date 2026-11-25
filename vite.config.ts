import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

function priceRouteDevRewrite(): Plugin {
  return {
    name: "portal-root-and-price-dev-rewrite",
    configureServer(server) {
      server.middlewares.stack.unshift({
        route: "",
        handle: (req, _res, next) => {
          const url = req.url || "";
          const [pathname, search = ""] = url.split("?");
          if (
            pathname === "/" ||
            pathname === "/system" ||
            pathname === "/price" ||
            pathname === "/price/"
          ) {
            req.url = `/system/index.html${search ? `?${search}` : ""}`;
          }
          next();
        },
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendTarget = env.VITE_BACKEND_URL || "http://127.0.0.1:3002";

  return {
    base: "/system/",
    plugins: [react(), priceRouteDevRewrite()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3005,
      proxy: {
        "/api": {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      minify: "esbuild",
    },
  };
});
