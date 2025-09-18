import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
let hasLoggedMissingTagger = false;

export default defineConfig(async ({ mode }) => {
  const plugins: PluginOption[] = [react()];

  if (mode === "development") {
    const taggerPlugin = await loadComponentTagger();
    if (taggerPlugin) {
      plugins.push(taggerPlugin);
    }
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
  };
});

async function loadComponentTagger(): Promise<PluginOption | null> {
  try {
    const mod = await import("lovable-tagger");
    if (typeof mod.componentTagger === "function") {
      return mod.componentTagger();
    }
    console.warn("lovable-tagger is missing a componentTagger export.");
  } catch (error) {
    if (isModuleNotFoundError(error)) {
      if (!hasLoggedMissingTagger) {
        console.warn(
          "lovable-tagger is not installed; skipping component tagging in development.",
        );
        hasLoggedMissingTagger = true;
      }
      return null;
    }
    throw error;
  }

  return null;
}

function isModuleNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as NodeJS.ErrnoException;
  if (candidate.code === "ERR_MODULE_NOT_FOUND") {
    return true;
  }

  if (
    error instanceof Error &&
    /Cannot find module ["']lovable-tagger["']/.test(error.message)
  ) {
    return true;
  }

  return false;
}
