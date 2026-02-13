import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      test: /\.(jpe?g|png|webp|avif)$/i, // Skip SVG (no svgo dep)
      jpg: { quality: 82, mozjpeg: true },
      jpeg: { quality: 82, mozjpeg: true },
      png: { quality: 85, compressionLevel: 6 },
      webp: { quality: 82, lossless: false },
      logStats: true,
    }),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
});
