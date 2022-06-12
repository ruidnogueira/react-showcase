import { Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export const vitePlugins: Plugin[] = [tsconfigPaths(), svgr()];
