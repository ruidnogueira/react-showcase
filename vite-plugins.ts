import type { PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { bundleI18n } from './plugins/bundle-i18n';

export const vitePlugins: PluginOption[] = [
  tsconfigPaths(),
  svgr({ svgrOptions: { ref: true } }),
  bundleI18n({ source: 'src/locales', destinationDir: 'locales' }),
];
