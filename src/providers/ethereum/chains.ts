import { pushTestnetChain } from "../../utils/chainDetails"
import * as viemChains from "viem/chains"

export const chains = {
    ...viemChains,
    pushWalletDonut: pushTestnetChain
}
