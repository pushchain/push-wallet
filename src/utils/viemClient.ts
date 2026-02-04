import { createPublicClient, http } from "viem";
import { pushTestnetChain } from "./chainDetails";

export const throttledHttp = http('https://evm.donut.rpc.push.org/', {
  retryCount: 3,
  retryDelay: 30_000,
});

export const viemClient = createPublicClient({
    chain: pushTestnetChain,
    transport: throttledHttp,
});


export async function fetchGasPriceInGwei() {
    const gasPriceWei = await viemClient.getGasPrice();
    const { formatUnits } = await import('viem');
    return formatUnits(gasPriceWei, 9);
}
