import { createPublicClient, http, formatUnits, type Address, erc20Abi } from 'viem';
import { useState } from 'react';
import { pushTestnetChain } from '../../utils/chainDetails';

export const useWalletBalance = () => {
    const [balance, setBalance] = useState<string>('0');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNativeBalance = async (address: string) => {
        try {
            console.log("Called ", address);

            setIsLoading(true);
            setError(null);
            const publicClient = createPublicClient({
                chain: pushTestnetChain,
                transport: http(),
            });

            const balance = await publicClient.getBalance({
                address: address as Address,
            });

            console.log("balance fetched ", balance);

            setBalance(formatUnits(balance, 18));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch balance');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTokenBalance = async (tokenAddress: `0x${string}`, walletAddress: `0x${string}`) => {
        try {
            const publicClient = createPublicClient({
                chain: pushTestnetChain,
                transport: http(),
            });

            const balance = await publicClient.readContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [walletAddress],
            });

            console.log(`Balance: ${balance.toString()}`);
            return balance;
        } catch (error) {
            console.error('Error fetching token balance:', error);
        }
    }


    return { balance, isLoading, error, fetchNativeBalance, fetchTokenBalance };
};