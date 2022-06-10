/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_E2E?: 'true';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
