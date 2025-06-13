import { createPublicClient, http } from "viem";
import { pushTestnetChain } from "./chainDetails";

export const viemClient = createPublicClient({
    chain: pushTestnetChain,
    transport: http
        (),
});
