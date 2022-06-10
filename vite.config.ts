/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePlugins } from './vite-plugins';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './build',
  },

  plugins: [react(), ...vitePlugins],

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
});
