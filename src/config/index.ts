/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// load the appropriate config as per the server state
import { ENV } from '../constants.ts'
import { mainnet, localhost, sepolia } from 'viem/chains'
import { config as generalConfig } from './config-general.ts'
import { Config } from './config.types.ts'

const env = import.meta.env.VITE_APP_ENV

// dynamic import
const dynamicConfigModule = await import(`./config-${env}`)
const dynamicConfig = dynamicConfigModule.config

// combine config
const config: Config = { ...dynamicConfig, ...generalConfig }

export const VALIDATOR_CONFIG = {
  [ENV.PROD]: {
    NETWORK: mainnet,
    VALIDATOR_CONTRACT: 'TODO',
  },
  [ENV.STAGING]: {
    NETWORK: sepolia,
    VALIDATOR_CONTRACT: 'TODO',
  },
  [ENV.DEV]: {
    NETWORK: sepolia,
    VALIDATOR_CONTRACT: '0xb08d2cA537F6183138955eD4fCb012f94f681954',
  },
  [ENV.LOCAL]: {
    NETWORK: localhost,
    VALIDATOR_CONTRACT: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  },
}

export default config
