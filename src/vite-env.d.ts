/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENROUTER_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.mjs?url' {
  const url: string;
  export default url;
}
