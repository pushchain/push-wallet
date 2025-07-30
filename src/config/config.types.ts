import {PushChain} from '@pushchain/core';

export interface Config {
  // App-specific Configuration
  APP_NAME: string
  NODE_ENV: string
  APP_ENV: typeof PushChain.CONSTANTS.PUSH_NETWORK

  // Chain Information
  ALLOWED_NETWORKS: number[]
  DEFAULT_CHAIN: number
}
