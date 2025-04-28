import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

// Use __dirname without ES module issues
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Fix paths by using require instead of __dirname
const __dirname = path.dirname(require.resolve('./vite.config.ts'));

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "client", "index.html"),
    },
  },
});
