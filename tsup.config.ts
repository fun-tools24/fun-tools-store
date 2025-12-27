import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    'index': './src/index.ts',
    'core/index': './src/index.ts',
    'react/index': './src/index.ts'
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react"]
});
