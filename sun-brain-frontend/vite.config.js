import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@entities': path.resolve(__dirname, 'src/entities'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@styles': path.resolve(__dirname, 'src/shared/styles'),
    },
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
      globalModulePaths: [],
      generateScopedName: undefined,
      hashPrefix: '',
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, 'src/shared/styles')],
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    cors: true,
  },
});
