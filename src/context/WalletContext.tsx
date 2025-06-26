import { createContext, ReactNode, useContext, useState } from "react";
import {
  ChainType,
  ITypedData,
  IWalletProvider,
  WalletInfo,
} from "../types/wallet.types";

type WalletContextType = {
  currentWallet: WalletInfo | null;
  connecting: boolean;
  connect: (
    provider: IWalletProvider,
    chainType?: ChainType
  ) => Promise<string | null>;
  disconnect: () => Promise<void>;
  signTransactionRequest: (data: Uint8Array) => Promise<Uint8Array>;
  signMessageRequest: (data: Uint8Array) => Promise<Uint8Array>;
  signTypedDataRequest: (data: Uint8Array) => Promise<Uint8Array>;
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

  const signTransactionRequest = async (
    data: Uint8Array
  ): Promise<Uint8Array> => {
    if (!currentProvider) {
      throw new Error("No wallet connected");
    }

    try {
      const signature = await currentProvider.signAndSendTransaction(data);
      console.log("receipt in wallet context", signature);
      return signature;
    } catch (error) {
      console.log("Error in generating signature", error);
      throw new Error("Signature request failed");
    }
  };

  const signMessageRequest = async (data: Uint8Array): Promise<Uint8Array> => {
    if (!currentProvider) {
      throw new Error("No wallet connected");
    }

    try {
      const signature = await currentProvider.signMessage(data);
      console.log("receipt in wallet context", signature);
      return signature;
    } catch (error) {
      console.log("Error in generating signature", error);
      throw new Error("Signature request failed");
    }
  };

  const signTypedDataRequest = async (
    data: ITypedData
  ): Promise<Uint8Array> => {
    if (!currentProvider) {
      throw new Error("No wallet connected");
    }

    try {
      const signature = await currentProvider.signTypedData(data);
      console.log("receipt in wallet context", signature);
      return signature;
    } catch (error) {
      console.log("Error in generating signature", error);
      throw new Error("Signature request failed");
    }
  };

  return (
    <WalletContext.Provider
      value={{
        currentWallet,
        connecting,
        connect,
        disconnect,
        signTransactionRequest,
        signMessageRequest,
        signTypedDataRequest,
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
