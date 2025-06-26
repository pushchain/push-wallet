import { pushTestnetChain } from "../utils/chainDetails";
import { Address, createPublicClient, erc20Abi, formatUnits, http } from "viem";

type fetchTokenBalanceProps = {
    walletAddress: Address,
    tokenAddress?: Address,
    decimals: number
}

export const fetchTokenBalance = async ({
    walletAddress,
    tokenAddress,
    decimals
}: fetchTokenBalanceProps) => {
    console.log("tokenAddress in token helper >>", tokenAddress);

    const publicClient = createPublicClient({
        chain: pushTestnetChain,
        transport: http(),
    });

    try {

        if (!tokenAddress) {
            // Native token
            const nativeBalance = await publicClient.getBalance({ address: walletAddress });
            return formatUnits(nativeBalance, decimals);
        }

        const balance = await publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [walletAddress],
        });

        console.log(`Balance: ${balance.toString()}`);
        return formatUnits(balance as bigint, decimals);
    } catch (error) {
        console.error('Error fetching token balance:', error);
        throw new Error('Error fetching token balance:')
    }
}
