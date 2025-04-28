import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { createRequire } from "module";
const require = createRequire(import.meta.url);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    // ❌ Remove that complicated "await import" part here
  ],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname, "client", "src"),
      "@shared": path.resolve(path.dirname, "shared"),
      "@assets": path.resolve(path.dirname, "attached_assets"),
    },
  },
  root: path.resolve(path.dirname, "client"),
  build: {
    outDir: path.resolve(path.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(path.dirname, "client", "index.html"),
    },
  },
});
