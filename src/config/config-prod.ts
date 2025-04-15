import { ENV } from "@pushchain/devnet/src/lib/constants";

export const config = {
  /**
   * APP INFO
   */
  APP_NAME: 'Push Wallet',
  NODE_ENV: 'prod',
  APP_ENV: ENV.MAINNET,

  /**
   * CHAIN INFO
   */
  ALLOWED_NETWORKS: [
    1, // for ethereum mainnet
    137, // for polygon mainnet
    56, // for bnb mainnet
    10, // for optimism mainnet
    42161, // arbitrum mainnet
    1101, // polygon zkevm mainnet
    122, // fuse mainnet
    7560, // Cyber mainnet
  ],
  DEFAULT_CHAIN: 1,
}
