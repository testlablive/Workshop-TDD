import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/dist/config";

export default defineConfig({
  test: {
    include: ["src/tests/{component,unit}/**/*.{test,spec}.?(c|m)[jt]s?(x)'"],
    global: true,
    environment: "happy-dom",
    cache: false,
    clearMocks: true,
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "html", "cobertura", "lcov"],
      reportsDirectory: "src/tests/report/coverage",
    },
    reporters: ["junit", "verbose"],
    outputFile: {
      junit: "src/tests/report/test-output.xml",
    },
  },
  plugins: [tsconfigPaths()],
});
