import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  minify: false,
  sourcemap: true,
  // treeshake: false,
  // external: ['apollo-server-core', 'express'],
  // noExternal: [/generated/],
  external: [/generated/, 'graphql', 'graphql-tag'],
  // noExternal: ['@prisma/client'],
});
