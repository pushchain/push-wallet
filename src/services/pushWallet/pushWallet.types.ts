import { HDKey } from '@scure/bip32'

export type EncPushAccount = {
  did: string
  derivedKeyIndex: number
  encDerivedPrivKey: string
}

export type DecPushAccount = {
  did: string
  mnemonic?: string
  derivedHDNode: HDKey
}

export type Key = {
  privateExtendedKey: string
  publicKey: string
  index: number
}

export type AppConnection = {
  origin: string
  isPending: boolean
}
