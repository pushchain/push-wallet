import { MetaMaskSDK } from "@metamask/sdk";
import { ChainType, ITypedData } from "../../types/wallet.types";
import { BaseWalletProvider } from "../BaseWalletProvider";
import { parseTransaction, toHex } from "viem";
import { BrowserProvider, getAddress } from 'ethers';
import { Chain } from 'viem';
import { chains } from "./chains";

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
        name: "Push Wallet",
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

  getProvider = () => {
    return this.sdk.getProvider();
  };

  getSigner = async () => {
    const sdkProvider = this.sdk.getProvider();
    if (!sdkProvider) {
      throw new Error('Provider is undefined');
    }
    const browserProvider = new BrowserProvider(sdkProvider);
    return await browserProvider.getSigner();
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

  switchNetwork = async (chainName: ChainType) => {
    console.log("chainName", chainName);
    const network = chains[chainName] as Chain
    const provider = this.getProvider();

    console.log("network", network);

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

  signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('Provider is undefined');
      }
      const accounts = (await provider.request({
        method: 'eth_accounts',
      })) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No connected account');
      }

      const hexMessage = '0x' + Buffer.from(message).toString('hex');

      const signature = await provider.request({
        method: 'personal_sign',
        params: [hexMessage, accounts[0]],
      });

      return new Uint8Array(Buffer.from((signature as string).slice(2), 'hex'));
    } catch (error) {
      console.error('MetaMask signing error:', error);
      throw error;
    }
  };

  signAndSendTransaction = async (txn: Uint8Array): Promise<Uint8Array> => {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('Provider is undefined');
      }
      const accounts = (await provider.request({
        method: 'eth_accounts',
      })) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No connected account');
      }

      const hex = ('0x' + Buffer.from(txn).toString('hex')) as `0x${string}`;
      const parsed = parseTransaction(hex);

      const txParams = {
        from: accounts[0],
        to: parsed.to,
        value: parsed.value ? '0x' + parsed.value.toString(16) : undefined,
        data: parsed.data,
        gas: parsed.gas ? '0x' + parsed.gas.toString(16) : undefined,
        maxPriorityFeePerGas: parsed.maxPriorityFeePerGas
          ? '0x' + parsed.maxPriorityFeePerGas.toString(16)
          : undefined,
        maxFeePerGas: parsed.maxFeePerGas
          ? '0x' + parsed.maxFeePerGas.toString(16)
          : undefined,
      };

      const signature = await provider.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });

      return new Uint8Array(Buffer.from((signature as string).slice(2), 'hex'));
    } catch (error) {
      console.error('MetaMask signing error:', error);
      throw error;
    }
  };

  signTypedData = async (typedData: ITypedData): Promise<Uint8Array> => {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('Provider is undefined');
      }
      const accounts = (await provider.request({
        method: 'eth_accounts',
      })) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No connected account');
      }

      const signature = await provider.request({
        method: 'eth_signTypedData_v4',
        params: [accounts[0], typedData],
      });

      return new Uint8Array(Buffer.from((signature as string).slice(2), 'hex'));
    } catch (error) {
      console.error('MetaMask signing error:', error);
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
  };
}
