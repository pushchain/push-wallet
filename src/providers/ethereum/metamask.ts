import { MetaMaskSDK } from "@metamask/sdk";
import { ChainType } from "../../types/wallet.types";
import { BaseWalletProvider } from "../BaseWalletProvider";
import { toHex } from "viem";
import { getAddress } from 'ethers';
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
      ChainType.PUSH_TESTNET
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
    const network = chains[chainName] as Chain
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

  async sendTransaction(to: string, value: bigint): Promise<string> {
    try {
      const provider = this.getProvider();
      if (!provider) throw new Error("Provider is undefined");

      const accounts = await provider.request({
        method: 'eth_accounts',
      }) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error("No connected accounts");
      }

      const from = accounts[0];

      const txParams = {
        from,
        to,
        value: `0x${value.toString(16)}`,
        gas: `0x${(21000n).toString(16)}`,
        maxFeePerGas: `0x${(100000n * 1_000_000_000n).toString(16)}`,
        maxPriorityFeePerGas: `0x${(100n * 1_000_000_000n).toString(16)}`,
      };

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      }) as string;

      console.log("Transaction sent, hash:", txHash);

      const receipt = await this.waitForTransactionReceipt(provider, txHash);

      if (!receipt || !receipt.status) {
        throw new Error("Transaction failed or was reverted");
      }

      console.log("Transaction confirmed:", receipt);
      return txHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  private async waitForTransactionReceipt(
    provider: any,
    txHash: string,
    retries = 30,
    delay = 2000
  ): Promise<any> {
    for (let i = 0; i < retries; i++) {
      const receipt = await provider.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      });

      if (receipt && receipt.blockNumber) {
        return receipt;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }

    throw new Error('Transaction not confirmed in time');
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
