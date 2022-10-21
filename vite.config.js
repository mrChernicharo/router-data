import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import postcss from './postcss.config.js'

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  css: {
    postcss,
  },
});
