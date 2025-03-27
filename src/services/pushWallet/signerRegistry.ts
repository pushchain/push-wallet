import { privateKeyToAccount } from 'viem/accounts'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import { HDKey } from 'viem/accounts'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { CHAIN } from '@pushchain/devnet/src/lib/constants'

export type ChainSignerHandler = (masterNode: HDKey) => Promise<{
  address: string
  signMessage: (data: Uint8Array) => Promise<Uint8Array>
}>

export const chainSignerRegistry: Partial<Record<CHAIN, ChainSignerHandler>> = {
  [CHAIN.ETHEREUM]: async (masterNode) => {
    const node = masterNode.derive("m/44'/60'/0'/0/0")
    const account = privateKeyToAccount(`0x${bytesToHex(node.privateKey!)}`)
    return {
      address: account.address,
      signMessage: async (data) => {
        const sig = await account.signMessage({ message: { raw: data } })
        return hexToBytes(sig)
      },
    }
  },

  [CHAIN.SOLANA]: async (masterNode) => {
    const node = masterNode.derive("m/44'/501'/0'/0'")
    const keypair = nacl.sign.keyPair.fromSeed(node.privateKey!.subarray(0, 32))
    return {
      address: bs58.encode(keypair.publicKey),
      signMessage: async (data) => nacl.sign.detached(data, keypair.secretKey),
    }
  },
}
