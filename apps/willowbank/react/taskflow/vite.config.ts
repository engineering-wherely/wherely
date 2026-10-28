/// <reference types="vitest/config" />

import react, {reactCompilerPreset} from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({
    presets: [
      reactCompilerPreset()
    ]
  })],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    deps: {
      optimizer: {
        client: {
          enabled: true,
          // Apply React deduplication inside the hoisted test renderer too.
          include: ["@testing-library/react"],
        },
      },
    },
  },
});
