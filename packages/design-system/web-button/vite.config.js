import { resolve } from "path";

import { defineConfig } from "vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

import pkg from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `web.button.${format}.js`,
    },
    outDir: resolve(__dirname, "./dist"),
    emptyOutDir: false,
    rollupOptions: {
      external: Object.keys(pkg.peerDependencies),
    },
    minify: false,
  },
  plugins: [vanillaExtractPlugin()],
});