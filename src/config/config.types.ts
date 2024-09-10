export interface Config {
  // App-specific Configuration
  APP_NAME: string
  NODE_ENV: string
  APP_ENV: string

  // Chain Information
  ALLOWED_NETWORKS: number[]
  DEFAULT_CHAIN: number
}
