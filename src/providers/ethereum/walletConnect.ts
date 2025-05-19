import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { getAddress } from 'ethers';
import { ChainType } from '../../types/wallet.types';
import { BaseWalletProvider } from '../BaseWalletProvider';
import * as chains from 'viem/chains';
import { toHex } from 'viem';

export class WalletConnectProvider extends BaseWalletProvider {
    private provider: InstanceType<typeof EthereumProvider> | null = null;

    constructor() {
        super('WalletConnect', 'https://walletconnect.com/walletconnect-logo.svg', [
            ChainType.WALLET_CONNECT,
        ]);
    }

    isInstalled = async (): Promise<boolean> => {
        return true;
    };

    getProvider = () => {
        if (!this.provider) {
            throw new Error('WalletConnect provider not initialized');
        }
        return this.provider;
    };

    initProvider = async (chainId: number) => {
        this.provider = await EthereumProvider.init({
            projectId: process.env.VITE_APP_REOWN_PROJECT_ID || "575a3e339ad56f54669c32264c133172",
            chains: [chainId],
            methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
            showQrModal: true,
        });

        await this.provider.enable();
    };

    async connect(): Promise<{ caipAddress: string }> {
        const chain = chains['mainnet'] as chains.Chain;
        const chainId = chain.id;

        await this.initProvider(chainId);

        const accounts = await this.provider!.request({
            method: 'eth_requestAccounts',
        });

        const rawAddress = accounts[0];
        const checksumAddress = getAddress(rawAddress);

        const caipAddress = this.formatAddress(checksumAddress, ChainType.ETHEREUM, chainId);
        return caipAddress;
    }

    getChainId = async (): Promise<number> => {
        const provider = this.getProvider();
        const hexChainId = await provider.request({ method: 'eth_chainId' });
        return parseInt(hexChainId.toString(), 16);
    };

    switchNetwork = async (chainType: ChainType) => {
        const provider = this.getProvider();
        const network = chains[chainType] as chains.Chain;
        const hexChainId = toHex(network.id);

        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: hexChainId }],
            });
        } catch (err: any) {
            if (err.code === 4902) {
                try {
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: hexChainId,
                                chainName: network.name,
                                rpcUrls: network.rpcUrls.default.http,
                                nativeCurrency: network.nativeCurrency,
                                blockExplorerUrls: [network.blockExplorers.default.url],
                            },
                        ],
                    });
                } catch (addError) {
                    console.error('Error adding network:', addError);
                    throw addError;
                }
            } else {
                console.error('Error switching network:', err);
                throw err;
            }
        }
    };

    disconnect = async () => {
        const provider = this.getProvider();
        if (provider && typeof provider.disconnect === 'function') {
            await provider.disconnect();
        }
    };
}
