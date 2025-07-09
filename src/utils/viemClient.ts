import { createPublicClient, http } from "viem";
import { pushTestnetChain } from "./chainDetails";

export const viemClient = createPublicClient({
    chain: pushTestnetChain,
    transport: http
        (),
});


export async function fetchGasPriceInGwei() {
    const gasPriceWei = await viemClient.getGasPrice();
    const { formatUnits } = await import('viem');
    return formatUnits(gasPriceWei, 9);
}
