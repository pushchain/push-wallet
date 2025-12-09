import { pushTestnetChain } from "../utils/chainDetails";
import { Address, createPublicClient, formatUnits, http } from "viem";

const publicClient = createPublicClient({
    chain: pushTestnetChain,
    transport: http(),
});

export const fetchUserBalance = async (address: string) => {
    try {
        const balance = await publicClient.getBalance({
            address: address as Address,
        });

        return formatUnits(balance, 18)
    } catch (error) {
        console.log("Error in fetching user balance", error);
        throw new Error('Error in fetching user balance')
    }

}