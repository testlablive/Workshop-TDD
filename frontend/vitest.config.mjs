import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/dist/config";

export default defineConfig({
  test: {
    include: ["tests/Vitest/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    global: true,
    environment: "happy-dom",
    cache: false,
    clearMocks: true,
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "html", "cobertura", "lcov"],
      reportsDirectory: "tests/report/coverage",
    },
    reporters: ["junit", "verbose"],
    outputFile: {
      junit: "tests/report/test-output.xml",
    },
  },
  plugins: [tsconfigPaths()],
});
