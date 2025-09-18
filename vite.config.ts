import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(async ({ mode }) => {
  let componentTaggerPlugin: PluginOption | null = null;

  if (mode === "development") {
    try {
      const module = await import("lovable-tagger");
      if (typeof module.componentTagger === "function") {
        componentTaggerPlugin = module.componentTagger();
      }
    } catch (error) {
      console.warn(
        "lovable-tagger plugin unavailable, continuing without component tagging.",
      );
    }
  }

  const plugins: PluginOption[] = [react()];

  if (componentTaggerPlugin) {
    plugins.push(componentTaggerPlugin);
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
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
      globals: true,
      setupFiles: "./tests/setup.ts",
    },
  };
});
