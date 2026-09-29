import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Pruebas unitarias y de integración. Los componentes corren en jsdom; las
// pruebas que leen la salida del build (out/) piden entorno node con el
// comentario `// @vitest-environment node` al principio del archivo.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // JSX automático (React 17+). Vitest 5 corre sobre Vite 8, que transforma
  // con Oxc: la opción `esbuild: { jsx: "automatic" }` ya no se aplica (Vite
  // la ignora con un aviso), así que va su equivalente.
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{ts,tsx}", "tests/integracion/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/preparar.ts"],
    restoreMocks: true,
    unstubGlobals: true,
  },
});
