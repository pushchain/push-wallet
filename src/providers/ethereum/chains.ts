import * as viemChains from "viem/chains"
import { defineChain } from 'viem'

export const pushTestnetChain = defineChain({
    id: 9000,
    name: 'Push Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'PUSH',
        symbol: 'PUSH',
    },
    rpcUrls: {
        default: {
            http: ['https://evm.pn1.dev.push.org'],
            webSocket: ['wss://evm.pn1.dev.push.org'],
        },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://explorer.dev.push.org' },
    },
})

export const chains = {
    ...viemChains,
    pushTestnet: pushTestnetChain
}
