import {PushChain} from '@pushchain/core';

export const config = {
  /**
   * APP INFO
   */
  APP_NAME: "Push Devnet Wallet",
  NODE_ENV: "dev",
  APP_ENV: PushChain.CONSTANTS.PUSH_NETWORK.TESTNET,
  /**
   * CHAIN INFO
   */
  ALLOWED_NETWORKS: [
    11155111, // for eth sepolia
    80002, // for amoy polygon
    97, // bnb testnet
    11155420, // optimism sepolia testnet
    2442, // polygon zkevm cardona testnet
    421614, // arbitrum testnet
    123, // fuse testnet
    111557560, // Cyber testnet
  ],
  DEFAULT_CHAIN: 11155111,
};
