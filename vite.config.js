import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    target: 'esnext', // or 'es2022'
  },
});
