import type { Abi } from 'viem'
import type { Chain } from 'viem/chains'

export interface Config {
  // General Configuration
  ABIS: {
    VALIDATOR: Abi
  }

  // App-specific Configuration
  APP_NAME: string
  NODE_ENV: string
  APP_ENV: string

  // Chain Information
  ALLOWED_NETWORKS: number[]
  DEFAULT_CHAIN: number

  // Validator Configuration
  VALIDATOR: {
    NETWORK: Chain
    CONTRACT: string
  }
}
