declare type Recordable<T = any> = Record<string, T>
declare type Nullable<T> = T | null

declare interface ViteEnv {
  VITE_GLOB_APP_TITLE: string
  VITE_GLOB_APP_SHORT_NAME: string
  VITE_PORT: number
  VITE_PUBLIC_PATH: string
  VITE_DROP_CONSOLE: boolean
  VITE_PROXY: [string, string][]
  VITE_LEGACY: boolean
  VITE_USE_MOCK: boolean
  VITE_GLOB_API_URL: string
}

declare interface ImportMetaEnv extends ViteEnv {
  __: unknown
}

declare interface Window {
  ethereum: any
}
