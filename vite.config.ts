import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const loadComponentTagger = (mode: string): Promise<PluginOption | null> => {
  if (mode !== "development") {
    return Promise.resolve(null);
  }

  return import("lovable-tagger")
    .then((module) => {
      if (typeof module.componentTagger === "function") {
        return module.componentTagger();
      }

      const fallback = module.default as
        | (() => PluginOption)
        | { componentTagger?: () => PluginOption }
        | undefined;

      if (typeof fallback === "function") {
        return fallback();
      }

      if (fallback && typeof fallback.componentTagger === "function") {
        return fallback.componentTagger();
      }

      return null;
    })
    .catch(() => null);
};

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const componentTaggerPlugin = await loadComponentTagger(mode);

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), ...(componentTaggerPlugin ? [componentTaggerPlugin] : [])],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "framer-motion": fileURLToPath(
          new URL("./src/compat/framer-motion.tsx", import.meta.url),
        ),
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: "./tests/setup.ts",
      css: true,
    },
  };
});
