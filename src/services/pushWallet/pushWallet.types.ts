import { HDKey } from '@scure/bip32'
import { EncryptedPrivateKey } from '../pushEncryption/pushEncryption.types'

export type EncPushAccount = {
  did: string
  derivedKeyIndex: number
  encDerivedPrivKey: EncryptedPrivateKey
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
