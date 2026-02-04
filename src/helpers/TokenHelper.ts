import { viemClient } from "../utils/viemClient";
import { pushTestnetChain } from "../utils/chainDetails";
import { Address, createPublicClient, erc20Abi, formatUnits, http } from "viem";

type fetchTokenBalanceProps = {
    walletAddress: Address,
    tokenAddress?: Address,
    decimals: number
}

export const TOKEN_LISTS = {
    ETHEREUM: [
        { 
            name: 'Ethereum',
            symbol: 'SepoliaETH',
            address: '',
            decimals: 18
        },
    ],
    BASE: [
        { 
            name: 'Base', 
            symbol: 'SepoliaETH', 
            address: '', 
            decimals: 18 
        },
    ],
    ARBITRUM: [
        { 
            name: 'Arbitrum', 
            symbol: 'SepoliaETH', 
            address: '', 
            decimals: 18 
        },
    ],
    BINANCE: [
        { 
            name: 'Binance', 
            symbol: 'TBNB', 
            address: '', 
            decimals: 18 
        },
    ],
    SOLANA: [
        { 
            name: 'Solana', 
            symbol: 'SOL', 
            address: '', 
            decimals: 9 
        },
    ],
}
export const fetchTokenBalance = async ({
    walletAddress,
    tokenAddress,
    decimals
}: fetchTokenBalanceProps) => {
    const publicClient = createPublicClient({
        chain: pushTestnetChain,
        transport: http(),
    });

    try {

        if (!tokenAddress) {
            const nativeBalance = await viemClient.getBalance({ address: walletAddress });
            return formatUnits(nativeBalance, decimals);
        }

        const balance = await viemClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [walletAddress],
        });

        return formatUnits(balance as bigint, decimals);
    } catch (error) {
        console.error('Error fetching token balance:', error);
        throw new Error('Error fetching token balance:')
    }
}
