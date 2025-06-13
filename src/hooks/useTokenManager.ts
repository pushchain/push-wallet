import { ERC20ABI } from 'common';
import { useEffect, useState } from 'react';
import { TokenFormat } from '../types';
import { isAddress } from 'viem';
import { viemClient } from '../utils/viemClient';

const DEFAULT_TOKEN = {
    name: 'Push Chain',
    symbol: 'PC',
    address: '0x999f186cda2b78dd59ffebe5aa994eea0b025dcb',
    decimals: 18,
};

export function useTokenManager() {
    const [tokens, setTokens] = useState<TokenFormat[]>([DEFAULT_TOKEN]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("userTokens") || "[]");

        // Merge stored tokens with default only if default not present
        const merged = [DEFAULT_TOKEN, ...stored.filter(t => t.address.toLowerCase() !== DEFAULT_TOKEN.address.toLowerCase())];
        setTokens(merged);
    }, []);

    useEffect(() => {
        localStorage.setItem("userTokens", JSON.stringify(tokens));
    }, [tokens]);

    const fetchTokenDetails = async (address: `0x${string}`): Promise<TokenFormat> => {
        try {
            if (!isAddress(address)) return

            const [symbol, decimals, name] = await Promise.all([
                viemClient.readContract({ address, abi: ERC20ABI, functionName: 'symbol' }) as Promise<string>,
                viemClient.readContract({ address, abi: ERC20ABI, functionName: 'decimals' }) as Promise<number>,
                viemClient.readContract({ address, abi: ERC20ABI, functionName: 'name' }) as Promise<string>,
            ]);

            return {
                address,
                name,
                symbol,
                decimals,
            } as TokenFormat;
        } catch (err) {
            console.warn("Not a valid token", err);
            throw new Error('No Token Found')
        }
    };

    const addToken = async (tokenDetails: TokenFormat) => {

        const addressInLowerCase = tokenDetails.address.toLowerCase();

        if (tokens.some(t => t.address.toLowerCase() === addressInLowerCase))
            return { error: 'Token already added' };

        if (tokens.length >= 20) return { error: 'Limit of 20 tokens reached' };

        setTokens(prev => [...prev, tokenDetails]);
        return { success: true };
    };

    const removeToken = (address) => {
        setTokens(prev => prev.filter(t => t.address.toLowerCase() !== address.toLowerCase()));
    };

    return { tokens, addToken, removeToken, fetchTokenDetails };
}
