/**
 * SUPPORTED ENVIRONEMENTS
 */
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
  OAUTH_REDIRECT: "/oauth-redirect",
  RECONNECT: "/reconnect",
};
