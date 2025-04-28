import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),   // Use __dirname here
      "@shared": path.resolve(__dirname, "shared"),   // Use __dirname here
      "@assets": path.resolve(__dirname, "attached_assets"), // Use __dirname here
    },
  },
  root: path.resolve(__dirname, "client"),   // Use __dirname here
  build: {
    outDir: path.resolve(__dirname, "dist/public"),   // Use __dirname here
    emptyOutDir: true,
  },
});
