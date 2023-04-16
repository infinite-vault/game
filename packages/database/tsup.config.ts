import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  minify: false,
  sourcemap: true,
  // external: ['apollo-server-core', 'express'],
  // external: [/generated/],
  // noExternal: [],
});
