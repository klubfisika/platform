/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly BETTER_AUTH_SECRET: string;
  readonly ORIGIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
