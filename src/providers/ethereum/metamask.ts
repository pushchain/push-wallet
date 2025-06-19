import { MetaMaskSDK } from "@metamask/sdk";
import { ChainType } from "../../types/wallet.types";
import { BaseWalletProvider } from "../BaseWalletProvider";
import { toHex } from "viem";
import { getAddress } from 'ethers';
import { chains } from "./chains";
import { Chain } from 'viem';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask: boolean;
    };
  }
}

export class MetamaskProvider extends BaseWalletProvider {
  private sdk: MetaMaskSDK;

  constructor() {
    super("MetaMask", "https://metamask.io/images/metamask-fox.svg", [
      ChainType.ETHEREUM,
      ChainType.ARBITRUM,
      ChainType.AVALANCHE,
      ChainType.BINANCE,
      ChainType.PUSH_WALLET
    ]);
    this.sdk = new MetaMaskSDK({
      dappMetadata: {
        name: "My Dapp",
        url: window.location.href,
      },
      logging: {
        sdk: false,
      },
      useDeeplink: true,
      injectProvider: true,
    });
  }

  isInstalled = async (): Promise<boolean> => {
    const provider = this.sdk.getProvider();
    if (window.ethereum && window.ethereum.isMetaMask) return true;

    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile && provider?.isMetaMask) return true;

    return false;
  };

  async connect(chainType: ChainType): Promise<{ caipAddress: string }> {
    try {
      const accounts = await this.sdk.connect();
      const rawAddress = accounts[0];
      const checksumAddress = getAddress(rawAddress);

      await this.switchNetwork(chainType);

      const chainId = await this.getChainId();

      const addressincaip = this.formatAddress(checksumAddress, ChainType.ETHEREUM, chainId);

      return addressincaip;

    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      throw error;
    }
  }

  getProvider = () => {
    return this.sdk.getProvider();
  };

  getChainId = async (): Promise<number> => {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error('Provider is undefined');
    }
    const hexChainId = await provider.request({
      method: 'eth_chainId',
      params: [],
    });

    const chainId = parseInt(hexChainId.toString(), 16);
    return chainId;
  };

  switchNetwork = async (chainName: ChainType) => {
    const network = chains[chainName] as Chain;
    const provider = this.getProvider();
    const hexNetworkId = toHex(network.id);

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexNetworkId }]
      });
    } catch (err) {
      if (err.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: hexNetworkId,
              chainName: network.name,
              rpcUrls: network.rpcUrls.default.http,
              nativeCurrency: network.nativeCurrency,
              blockExplorerUrls: network.blockExplorers.default.url
            }]
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          throw addError
        }
      } else {
        console.error("Error switching network:", err);
        throw err;
      }
    }

  }

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
