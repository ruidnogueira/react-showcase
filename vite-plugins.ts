import { Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export const vitePlugins: Plugin[] = [tsconfigPaths()];
