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
      const walletInfo = await provider.connect(chainType);

      const walletDetails = {
        address: walletInfo,
        chainType,
        providerName: provider.name,
      };
      setCurrentWallet(walletDetails);
      setCurrentProvider(provider);
      return walletInfo;
    } catch (error) {
      throw new Error('Failed to connect wallet');
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
        throw new Error('Failed to disconnect wallet');
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        currentWallet,
        connecting,
        connect,
        disconnect,
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
