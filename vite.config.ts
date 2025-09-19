import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "framer-motion": fileURLToPath(new URL("./src/compat/framer-motion.tsx", import.meta.url)),
      "react-router-dom": fileURLToPath(new URL("./src/lib/router.tsx", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    css: true,
  },
});
