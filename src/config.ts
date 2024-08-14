import { ENV } from './constants'
import { validatorABI } from './abis/validator.ts'
import { mainnet, localhost, sepolia } from 'viem/chains'

export const SOURCE: { [key: string]: string } = {
  'eip155:1': 'ETH_MAINNET',
  'eip155:11155111': 'ETH_SEPOLIA',
  'eip155:137': 'POLYGON_MAINNET',
  'eip155:80002': 'POLYGON_AMOY',
  'eip155:56': 'BSC_MAINNET',
  'eip155:97': 'BSC_TESTNET',
  'eip155:10': 'OPTIMISM_MAINNET',
  'eip155:11155420': 'OPTIMISM_TESTNET',
  'eip155:1101': 'POLYGON_ZK_EVM_MAINNET',
  'eip155:2442': 'POLYGON_ZK_EVM_TESTNET',
  'eip155:42161': 'ARBITRUMONE_MAINNET',
  'eip155:421614': 'ARBITRUM_TESTNET',
  'eip155:122': 'FUSE_MAINNET',
  'eip155:123': 'FUSE_TESTNET',
  'eip155:80085': 'BERACHAIN_TESTNET',
  'eip155:7560': 'CYBER_CONNECT_MAINNET',
  'eip155:111557560': 'CYBER_CONNECT_TESTNET',
}

export const ABIS = {
  VALIDATOR: validatorABI,
}

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
