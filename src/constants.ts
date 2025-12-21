/**
 * SUPPORTED ENVIRONEMENTS
 */

import { CHAIN } from "@pushchain/core/src/lib/constants/enums";

export enum ENV {
  PROD = "prod",
  STAGING = "staging",
  DEV = "dev",
  /**
   * **This is for local development only**
   */
  LOCAL = "local",
}

/**
 * WALLET STATES
 */
export enum WALLET_STATE {
  UNINITIALIZED,
  SIGNUP,
  LOGIN,
  INITIALIZED,
}

// CAIP Namespaces
export const chainToNamespace = {
  EVM: "eip155",
  SOL: "solana",
};

// SOLANA ChainIds
export const networkToSolChainId = {
  mainnet: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
  devnet: "EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
  testnet: "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",
};

export const APP_ROUTES = {
  AUTH: "/auth",
  WALLET: "/wallet",
  VERIFY_EMAIL_OTP: "/verify-email-otp",
  REVERIFY_EMAIL_OTP: "/reverify-email-otp",
  OAUTH_REDIRECT: "/oauth-redirect",
};

export const PRC20_TOKENS = [
  { symbol: 'ETH',    sourceChain: CHAIN.ETHEREUM_SEPOLIA,  prc20Address: '0x2971824Db68229D087931155C2b8bB820B275809' },
  { symbol: 'WETH',   sourceChain: CHAIN.ETHEREUM_SEPOLIA,  prc20Address: '0x0d0dF7E8807430A81104EA84d926139816eC7586' },
  { symbol: 'USDT',   sourceChain: CHAIN.ETHEREUM_SEPOLIA,  prc20Address: '0xCA0C5E6F002A389E1580F0DB7cd06e4549B5F9d3' },
  { symbol: 'stETH',  sourceChain: CHAIN.ETHEREUM_SEPOLIA,  prc20Address: '0xaf89E805949c628ebde3262e91dc4ab9eA12668E' },
  { symbol: 'USDC',   sourceChain: CHAIN.ETHEREUM_SEPOLIA,  prc20Address: '0x387b9C8Db60E74999aAAC5A2b7825b400F12d68E' },
  { symbol: 'SOL',    sourceChain: CHAIN.SOLANA_DEVNET,     prc20Address: '0x5D525Df2bD99a6e7ec58b76aF2fd95F39874EBed' },
  { symbol: 'USDC',   sourceChain: CHAIN.SOLANA_DEVNET,     prc20Address: '0x04B8F634ABC7C879763F623e0f0550a4b5c4426F' },
  { symbol: 'USDT',   sourceChain: CHAIN.SOLANA_DEVNET,     prc20Address: '0x4f1A3D22d170a2F4Bddb37845a962322e24f4e34' },
  { symbol: 'DAI',    sourceChain: CHAIN.SOLANA_DEVNET,     prc20Address: '0x5861f56A556c990358cc9cccd8B5baa3767982A8' },
  { symbol: 'ETH',    sourceChain: CHAIN.BASE_SEPOLIA,      prc20Address: '0xc7007af2B24D4eb963fc9633B0c66e1d2D90Fc21' },
  { symbol: 'USDT',   sourceChain: CHAIN.BASE_SEPOLIA,      prc20Address: '0x2C455189D2af6643B924A981a9080CcC63d5a567' },
  { symbol: 'USDC',   sourceChain: CHAIN.BASE_SEPOLIA,      prc20Address: '0x84B62e44F667F692F7739Ca6040cD17DA02068A8' },
  { symbol: 'ETH',    sourceChain: CHAIN.ARBITRUM_SEPOLIA,  prc20Address: '0xc0a821a1AfEd1322c5e15f1F4586C0B8cE65400e' },
  { symbol: 'USDC',   sourceChain: CHAIN.ARBITRUM_SEPOLIA,  prc20Address: '0xa261A10e94aE4bA88EE8c5845CbE7266bD679DD6' },
  { symbol: 'USDT',   sourceChain: CHAIN.ARBITRUM_SEPOLIA,  prc20Address: '0x76Ad08339dF606BeEDe06f90e3FaF82c5b2fb2E9' },
  { symbol: 'USDT',   sourceChain: CHAIN.BNB_TESTNET,       prc20Address: '0x2f98B4235FD2BA0173a2B056D722879360B12E7b' },
  { symbol: 'BNB',    sourceChain: CHAIN.BNB_TESTNET,       prc20Address: '0x7a9082dA308f3fa005beA7dB0d203b3b86664E36' },
];