import { ChainType } from "../../types/wallet.types";
import { BaseWalletProvider } from "../BaseWalletProvider";
import * as chains from "viem/chains";
export class PhantomProvider extends BaseWalletProvider {
  constructor() {
    super("Phantom", "https://www.phantom.app/img/logo.png", [
      ChainType.ETHEREUM,
      ChainType.SOLANA,
    ]);
  }

  isInstalled = async (): Promise<boolean> => {
    return (
      typeof window !== "undefined" && typeof window.phantom !== "undefined"
    );
  };

  private connectEthereum = async (): Promise<string> => {
    if (!window.phantom || !window.phantom?.ethereum) {
      throw new Error("Phantom not installed for Ethereum");
    }

    const provider = window.phantom?.ethereum;
    const accounts = await provider.request({ method: "eth_requestAccounts" });

    return accounts[0];
  };

  private connectSolana = async (): Promise<string> => {
    if (!window.phantom || !window.phantom?.solana) {
      throw new Error("Phantom not installed for Solana");
    }

    const provider = window.phantom?.solana;
    const accounts = await provider.connect();

    return accounts.publicKey.toString();
  };

  connect = async (chainType?: ChainType): Promise<string> => {
    try {
      let account;
      if (!chainType || chainType === ChainType.SOLANA) {
        account = this.connectSolana();
      } else if (chainType === ChainType.ETHEREUM) {
        account = this.connectEthereum();
      }

      return account;
    } catch (error) {
      console.warn("Error in connecting to the wallet", error);
      throw error
    }
  };

  signMessage = async (message: string): Promise<string> => {
    const isInstalled = this.isInstalled();
    if (!isInstalled) return "Phantom is not installed";

    if (window.phantom.solana && window.phantom.solana.isConnected) {
      try {
        const provider = window.phantom?.solana;
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await provider.signMessage(
          encodedMessage,
          "utf8"
        );

        return signedMessage.signature.toString("hex");
      } catch (error) {
        console.error("Phantom Solana signing error:", error);
        throw error;
      }
    } else if (window.phantom.ethereum && window.phantom.ethereum.isConnected) {
      try {
        const provider = window.phantom?.ethereum;

        const accounts = await provider.request({
          method: "eth_accounts",
        });

        if (!accounts || accounts.length === 0) {
          throw new Error("No connected account");
        }

        const signature = await provider.request({
          method: "personal_sign",
          params: [message, accounts[0]],
        });

        return signature;
      } catch (error) {
        console.error("Phantom Ethereum signing error:", error);
        throw error;
      }
    } else {
      throw new Error("No Phantom wallet connected");
    }
  };

  getChainId = async (chainType?: ChainType): Promise<number> => {
    if (chainType === ChainType.ETHEREUM) {
      const provider = window.phantom.ethereum;
      const chainId = await provider.request({ method: 'eth_chainId' });
      return parseInt(chainId, 16);
    } else if (chainType === ChainType.SOLANA) {
      const provider = window.phantom.solana;
      return provider.chainId || 1;
    }
    throw new Error('No Phantom wallet connected');
  };

  switchNetwork = async (chainName: ChainType) => {
    const network = chains[chainName] as chains.Chain

    if (!window.phantom || !window.phantom?.ethereum) {
      throw new Error("Phantom not installed for Ethereum");
    }

    const provider = window.phantom?.ethereum;

    try {
      // Try to switch to the network
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.id }]
      });
    } catch (err) {
      // If the error code is 4902, the network needs to be added
      if (err.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: network.id,
              chainName: network.name,
              rpcUrls: network.rpcUrls,
              nativeCurrency: network.nativeCurrency,
              blockExplorerUrls: network.blockExplorers
            }]
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
        }
      } else {
        console.error("Error switching network:", err);
      }
    }

  }

  disconnect = async (): Promise<void> => {
    const isInstalled = this.isInstalled();
    if (!isInstalled) return;

    if (window.phantom.solana.isConnected) {
      const provider = window.phantom?.solana;
      await provider.disconnect();
    }

    if (window.phantom.ethereum.isConnected) {
      const provider = window.phantom?.ethereum;
      await provider.request({
        method: "wallet_revokePermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
    }

    return Promise.resolve();
  };
}
