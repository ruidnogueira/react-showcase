/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePlugins } from './vite-plugins';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const baseUrl = env.VITE_BASE_URL;

  return {
    base: baseUrl,

    server: {
      open: baseUrl,
    },

    build: {
      outDir: './build',
    },

    plugins: [react(), visualizer({ filename: 'dependency-stats.html' }), ...vitePlugins],

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
        ],
        reporter: ['lcov', 'text-summary'],
      },
    },
  };
});
