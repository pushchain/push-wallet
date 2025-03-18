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
  connect(chainType?: ChainType): Promise<string>;
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