/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePlugins } from './vite-plugins';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const baseUrl = env.VITE_BASE_URL;
  const isE2e = env.VITE_E2E === 'true';

  return {
    base: baseUrl,

    server: {
      open: mode === 'test' ? undefined : baseUrl,
    },

    build: {
      outDir: './build',
    },

    plugins: [
      react(),
      VitePWA(isE2e ? { injectRegister: null } : pwaOptions),
      visualizer({ filename: 'dependency-stats.html' }),
      ...vitePlugins,
    ],

    // https://github.com/vitest-dev/vitest
    test: {
      globals: true,
      include: ['src/**/*.test.*'],
      environment: 'jsdom',
      setupFiles: 'src/test/setup-tests.ts',
      coverage: {
        // threshold
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,

        // config
        all: true,
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          '**/*.test.*',
          '**/*.stories.*',
          'src/test',
          'src/mocks',
          'src/stories',
          'src/main.tsx',
          'src/vite-env.d.ts',
          'src/service-worker.ts',
        ],
        reporter: ['lcov', 'text-summary'],
      },
    },
  };
});

const pwaOptions: Partial<VitePWAOptions> = {
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'service-worker.ts',
  includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
  manifest: {
    name: 'Showcase',
    short_name: 'Showcase',
    description: 'A project to practice and showcase what I have learned',
    theme_color: '#222222',
    background_color: '#222222',
    display: 'standalone',
    icons: [
      {
        src: 'android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
};
