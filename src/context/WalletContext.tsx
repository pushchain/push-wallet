import { createContext, ReactNode, useContext, useState } from "react";
import { ChainType, IWalletProvider, WalletInfo } from "../types/wallet.types";

type WalletContextType = {
  currentWallet: WalletInfo | null;
  connecting: boolean;
  connect: (
    provider: IWalletProvider,
    chainType?: ChainType
  ) => Promise<string | null>;
  disconnect: () => Promise<void>;
  sendTransaction: (to: string, value: bigint) => Promise<string>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentWallet, setCurrentWallet] = useState<WalletInfo | null>(null);
  const [currentProvider, setCurrentProvider] =
    useState<IWalletProvider | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = async (provider: IWalletProvider, chainType?: ChainType) => {
    try {
      setConnecting(true);
      const { caipAddress } = await provider.connect(chainType);

      const walletDetails: WalletInfo = {
        address: caipAddress,
        chainType,
        providerName: provider.name,
      };
      setCurrentWallet(walletDetails);
      setCurrentProvider(provider);
      return caipAddress;
    } catch (error) {
      throw new Error("Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (currentProvider) {
      try {
        await currentProvider.disconnect();
        setCurrentWallet(null);
        setCurrentProvider(null);
      } catch (error) {
        console.error("Failed to disconnect:", error);
        throw new Error("Failed to disconnect wallet");
      }
    }
  };

  const sendTransaction = async (
    to: string,
    value: bigint
  ): Promise<string> => {
    if (!currentProvider) {
      throw new Error("No wallet connected");
    }

    try {
      const txHash = await currentProvider.sendTransaction(to, value);
      return txHash;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        currentWallet,
        connecting,
        connect,
        disconnect,
        sendTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
