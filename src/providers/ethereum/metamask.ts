import { MetaMaskSDK } from "@metamask/sdk";
import { ChainType } from "../../types/wallet.types";
import { BaseWalletProvider } from "../BaseWalletProvider";

export class MetamaskProvider extends BaseWalletProvider {
  private sdk: MetaMaskSDK;

  constructor() {
    super("MetaMask", "https://metamask.io/images/metamask-fox.svg", [
      ChainType.ETHEREUM,
    ]);
    this.sdk = new MetaMaskSDK({
      dappMetadata: {
        name: "Your Dapp Name",
        url: window.location.href,
      },
    });
  }

  isInstalled = async (): Promise<boolean> => {
    const provider = this.sdk.getProvider();
    return !!provider;
  };

  async connect(): Promise<string> {
    try {
      const accounts = await this.sdk.connect();
      return accounts[0];
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      throw error;
    }
  }

  getProvider = () => {
    return this.sdk.getProvider();
  };

  getChainId = async (): Promise<unknown> => {
    const provider = this.getProvider();
    const chainId = await provider.request({
      method: "eth_chainId",
      params: [],
    });
    return chainId;
  };

  signMessage = async (message: string): Promise<string> => {
    try {
      const provider = this.getProvider();
      const accounts = await provider.request({ method: "eth_accounts" });

      if (!accounts) {
        throw new Error("No connected account");
      }

      const signature = await provider.request({
        method: "personal_sign",
        params: [message, accounts[0]],
      });

      return signature as string;
    } catch (error) {
      console.error("MetaMask signing error:", error);
      throw error;
    }
  };

  disconnect = async () => {
    const provider = this.getProvider();
    await provider.request({
      method: "wallet_revokePermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });

    //TODO: reload the dapp after disconnecting the wallet
  };
}
