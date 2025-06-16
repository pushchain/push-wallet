import { ReactNode } from "react";

export enum ChainType {
  ETHEREUM = "mainnet",
  SOLANA = "solana",
  BINANCE = "bsc",
  ARBITRUM = "arbitrum",
  AVALANCHE = "avalanche",
  WALLET_CONNECT = "walletConnect",
  PUSH_TESTNET = 'pushTestnet'
}
export interface WalletInfo {
  address: string;
  chainType: ChainType;
  providerName: string;
}

export interface IWalletProvider {
  name: string;
  icon: string;
  supportedChains: ChainType[];
  connect(chainType?: ChainType): Promise<{ caipAddress: string }>;
  disconnect(): Promise<void>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  getChainId(): Promise<unknown>;
  switchNetwork(chainName: ChainType): Promise<void>;
  sendTransaction: (to: string, value: bigint) => Promise<string>; // ✅ new
}

export type WalletCategoriesType = {
  chain: ChainType;
  wallet: 'ethereum' | 'solana' | 'walletConnect';
  label: string;
  icon: ReactNode;
  isMobile: boolean;
};

export const CONSTANTS = {
  CHAIN: { EVM: 'evm', SOLANA: 'solana' },
  THEME: { LIGHT: 'light', DARK: 'dark' },
}

export type LoginMethodConfig = {
  email: boolean;
  google: boolean;
  wallet: {
    enabled: boolean;
    chains?: (typeof CONSTANTS.CHAIN)[keyof typeof CONSTANTS.CHAIN][];
  };
  appPreview?: boolean;
}

export type AppMetadata = {
  title: string;
  logoURL?: string;
  description?: string;
}

export interface WalletConfig {
  loginDefaults: LoginMethodConfig,
  appMetadata: AppMetadata,
}
