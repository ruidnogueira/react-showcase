import type { Plugin, PluginOption, ResolvedConfig } from 'vite';
import { normalizePath } from 'vite';
import fs from 'fs';
import path from 'path';
import picomatch from 'picomatch';

const bundledFileName = 'translation.json';
const virtualModuleId = 'virtual:i18n';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

/**
 * Bundles i18n translations files into a single file.
 * This is to avoid having multiple translation files
 * in production and having to perform a HTTP request
 * for each of them.
 */
export function bundleI18n({
  source,
  destinationDir,
}: {
  source: string;
  destinationDir: string;
}): PluginOption[] {
  return [serveI18n({ source, destinationDir }), buildI18n({ source, destinationDir })];
}

export function serveI18n({
  source,
  destinationDir,
}: {
  source: string;
  destinationDir: string;
}): Plugin {
  let config: ResolvedConfig;
  let bundledLocales: Map<string, Record<string, unknown>>;

  let webSourcePath: string;
  let isLocale: picomatch.Matcher;

  let fileSourcePath: string;
  let shouldReload: picomatch.Matcher;

  return {
    name: 'vite-plugin-merge-i18n',
    apply: 'serve',
    configResolved(resolvedConfig) {
      config = resolvedConfig;

      webSourcePath = `${config.base}${destinationDir}`;
      const webSourceFilesPath = `${config.base}${destinationDir}/*/${bundledFileName}`;
      isLocale = picomatch(webSourceFilesPath);

      fileSourcePath = normalizePath(path.resolve(config.root, source));
      const fileSourceFilesPath = normalizePath(path.resolve(config.root, source, '**/*.json'));
      shouldReload = picomatch(fileSourceFilesPath);
    },
    buildStart() {
      bundledLocales = bundleLocales({ root: config.root, source });
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default new Map(${JSON.stringify(Array.from(bundledLocales))})`;
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.originalUrl && isLocale(req.originalUrl)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const requestedLanguage = req.originalUrl
            .substring(webSourcePath.length + 1)
            .split('/')[0]!;

          const locale = bundledLocales.get(requestedLanguage);

          res.end(JSON.stringify(locale));
        } else {
          next();
        }
      });
    },
    handleHotUpdate({ file, server }) {
      if (shouldReload(normalizePath(file))) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const changedLanguage = file.substring(fileSourcePath.length + 1).split('/')[0]!;

        const bundledLocale = bundleLocales({ root: config.root, source, changedLanguage }).get(
          changedLanguage
        );

        if (bundledLocale) {
          bundledLocales.set(changedLanguage, bundledLocale);

          server.ws.send({
            type: 'full-reload',
            path: '*',
          });
        }
      }
    },
  };
}

export function buildI18n({
  source,
  destinationDir,
}: {
  source: string;
  destinationDir: string;
}): Plugin {
  let config: ResolvedConfig;
  let bundledLocales: Map<string, Record<string, unknown>>;

  return {
    name: 'vite-plugin-merge-i18n',
    apply: 'build',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    buildStart() {
      bundledLocales = bundleLocales({ root: config.root, source });
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default new Map(${JSON.stringify(Array.from(bundledLocales))})`;
      }
    },
    closeBundle() {
      const destination = path.resolve(config.root, config.build.outDir, destinationDir);
      saveLocales({ root: config.root, destination, bundledLocales });
    },
  };
}

function bundleLocales({
  root,
  source,
  changedLanguage,
}: {
  root: string;
  source: string;
  changedLanguage?: string;
}): Map<string, Record<string, unknown>> {
  const bundledLocales = fs
    .readdirSync(source)
    .filter((language) => !changedLanguage || language === changedLanguage)
    .map((language) => {
      const languageDirPath = path.resolve(root, source, language);
      const isDirectory = fs.lstatSync(languageDirPath).isDirectory();

      if (!isDirectory) return;

      const bundle = fs
        .readdirSync(languageDirPath)
        .filter((file) => path.extname(file) === '.json')
        .map((file) => {
          const namespace = path.parse(file).name;
          const fileData = fs.readFileSync(path.resolve(languageDirPath, file));
          const json = JSON.parse(fileData.toString());

          return { namespace, json };
        })
        .reduce<Record<string, unknown>>((bundle, { namespace, json }) => {
          bundle[namespace] = json;
          return bundle;
        }, {});

      return [language, bundle] as const;
    })
    .filter((bundle): bundle is [string, Record<string, unknown>] => Boolean(bundle));

  return new Map(bundledLocales);
}

function saveLocales({
  root,
  destination,
  bundledLocales,
}: {
  root: string;
  destination: string;
  bundledLocales: Map<string, Record<string, unknown>>;
}) {
  bundledLocales.forEach((bundle, language) => {
    const destinationDirPath = path.resolve(root, destination, language);
    const destinationPath = path.resolve(destinationDirPath, bundledFileName);

    fs.mkdirSync(destinationDirPath, { recursive: true });
    fs.writeFileSync(destinationPath, JSON.stringify(bundle));
  });
}
