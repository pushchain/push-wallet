import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const EVM_CHAIN_CONFIGS = {
    1: mainnet,
    11155111: sepolia,
    // Add more chainId: config as needed
};

/**
 * Fetches the native token balance for a wallet address depending on the chain.
 * @param token - The token object (expects native token to have address === '')
 * @param walletDetail - { address, chain, chainId }
 * @returns { balance, loading }
 */
export function useNativeTokenBalance(token, walletDetail) {
    const [balance, setBalance] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function fetchBalance() {
            setLoading(true);
            try {
                if (walletDetail.chain?.toLowerCase() === 'solana') {
                    // Solana
                    const network = 'mainnet-beta'; // or 'devnet', 'testnet' as needed
                    const connection = new Connection(clusterApiUrl(network));
                    const publicKey = new PublicKey(walletDetail.address);
                    const lamports = await connection.getBalance(publicKey);
                    const sol = lamports / 1e9;
                    if (!cancelled) setBalance(sol.toLocaleString(undefined, { maximumFractionDigits: 6 }));
                } else {
                    // EVM
                    const chainId = Number(walletDetail.chainId) || 1;
                    const chain = EVM_CHAIN_CONFIGS[chainId] || mainnet;
                    const client = createPublicClient({ chain, transport: http() });
                    const wei = await client.getBalance({ address: walletDetail.address });
                    const eth = Number(wei) / 1e18;
                    if (!cancelled) setBalance(eth.toLocaleString(undefined, { maximumFractionDigits: 6 }));
                }
            } catch (err) {
                if (!cancelled) setBalance('0');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        if (token && walletDetail && token.address === '') {
            fetchBalance();
        }
        return () => { cancelled = true; };
    }, [token, walletDetail]);

    return { balance, loading };
} 