import { ReactNode } from "react";

export enum ChainType {
  ETHEREUM = "mainnet",
  SOLANA = "solana",
  BINANCE = "bsc",
  ARBITRUM = "arbitrum",
  AVALANCHE = "avalanche",
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
  getChainId(): Promise<unknown>;
  switchNetwork(chainName: ChainType): Promise<void>;
}

export type WalletCategoriesType = {
  chain: ChainType;
  wallet: 'ethereum' | 'solana';
  label: string;
  icon: ReactNode;
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