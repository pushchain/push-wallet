import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import { HDKey } from '@scure/bip32'
import {
  bytesToHex,
  hexToBytes,
  randomBytes,
  utf8ToBytes,
} from '@noble/hashes/utils'
import {
  Key,
  EncPushAccount,
  DecPushAccount,
  AppConnection,
} from './pushWallet.types'
import { WalletClient } from 'viem'
import { PushValidator } from '../pushValidator/pushValidator'
import { PushSigner } from '../pushSigner/pushSigner'
import { Signer } from '../pushSigner/pushSigner.types'
import { PushEncryption } from '../pushEncryption/pushEncryption'
import { sha256 } from '@noble/hashes/sha256'
import { PushTx } from '../pushTransaction/pushTx'
import { InitDidTxData, TxCategory } from '../pushTransaction/pushTx.types'
import { TokenReply } from '../pushValidator/pushValidator.types'
import { ENV } from '../../constants'

export class PushWallet {
  /*
    Purpose (44'): Specifies BIP-44.
    Coin Type (60'): Specifies Ethereum (60 is the coin type for Ethereum).
    Account (0'): Used to manage different accounts in the wallet.
    Change (0): 0 for external addresses, 1 for internal/change addresses.
  */
  private static rootPath: `m/44'/60'/${string}` = "m/44'/60'/0'"
  private static pushValidator: PushValidator
  public appConnections: AppConnection[]

  private constructor(
    public did: string,
    public account: string,
    private derivedHDNode: HDKey,
    private mnemonic: string | undefined = undefined
  ) {
    this.appConnections = []
  }

  /**
   * @param walletClient Connected web3 signer
   * @param mnemonic Optional - In case user wants to derive keys from mnemonic itself rather than decrypting
   * @returns Push Wallet Instance
   */
  public static initialize = async (
    walletClient: WalletClient,
    options?: { mnemonic?: string; env: ENV }
  ): Promise<PushWallet> => {
    this.pushValidator = await PushValidator.initalize({ env: options?.env })
    const pushSigner = await PushSigner.initialize(walletClient)
    const pushAccount = await this.getPushAccount(pushSigner.account)
    const decryptedPushAccount = pushAccount
      ? await this.decryptPushAccount(
          pushAccount,
          pushSigner,
          options?.mnemonic
        )
      : await this.createPushAccount(pushSigner)

    return new PushWallet(
      decryptedPushAccount.did,
      pushSigner.account,
      decryptedPushAccount.derivedHDNode,
      decryptedPushAccount.mnemonic
    )
  }

  /**
   * Get Push Account details from Push Network
   * @param account - account in CAIP-10 Format
   */
  private static getPushAccount = async (
    account: string
  ): Promise<null | EncPushAccount> => {
    // TODO: REMOVE RETURN STATEMENT
    return null
    return await this.pushValidator.call<null | EncPushAccount>(
      'push_accountInfo',
      [account]
    )
  }

  /**
   * @description Derives a hardened key from master key
   * @param mnemonic
   * @param derivedKeyIndex
   */
  private static generateDerivedKey = async (
    mnemonic: string,
    derivedKeyIndex: number = 0
  ): Promise<Key> => {
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const masterNode = HDKey.fromMasterSeed(seed)
    const derivedNode = masterNode.derive(
      `${PushWallet.rootPath}/0'/${derivedKeyIndex}'`
    )
    return {
      privateExtendedKey: derivedNode.privateExtendedKey, // pk + chainCode
      publicKey: bytesToHex(derivedNode.publicKey as Uint8Array),
      index: derivedNode.index,
    }
  }

  private static createPushAccount = async (
    signer: Signer
  ): Promise<DecPushAccount> => {
    // 1. Create mnemonic and derived HD keys
    const mnemonic = bip39.generateMnemonic(wordlist) // 128 bit ( 12 words )
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const masterNode = HDKey.fromMasterSeed(seed)
    const derivedKey = await this.generateDerivedKey(mnemonic)

    // 2. Encrypt derived key's extended private key
    const encDerivedPrivKey = await PushEncryption.encrypt(
      derivedKey.privateExtendedKey,
      signer
    )

    // 3. Create Init Tx
    // TODO: REMOVE HARDCODED TOKEN
    const token = {
      validatorToken:
        'eyJub2RlcyI6W3sibm9kZUlkIjoiMHg4ZTEyZEUxMkMzNWVBQmYzNWI1NmIwNEU1M0M0RTQ2OGU0NjcyN0U4IiwidHNNaWxsaXMiOjE3MjA2Mjk4MTAwODIsInJhbmRvbUhleCI6ImEyODBmNzU1ZTc5NmFkZTYyYzIzMTFkMjUxMjIxMjI2NWRjZWJhNzAiLCJwaW5nUmVzdWx0cyI6W3sibm9kZUlkIjoiMHhmREFFYWY3YWZDRmJiNGU0ZDE2REM2NmJEMjAzOWZkNjAwNENGY2U4IiwidHNNaWxsaXMiOjE3MjA2Mjk3ODAxNTMsInN0YXR1cyI6MX0seyJub2RlSWQiOiIweDk4RjlEOTEwQWVmOUIzQjlBNDUxMzdhZjFDQTc2NzVlRDkwYTUzNTUiLCJ0c01pbGxpcyI6MTcyMDYyOTc4MDE1MCwic3RhdHVzIjoxfV0sInNpZ25hdHVyZSI6IjB4NzBiMmVkYjMzYTgzZWM3MWFlYmZiYjc4NmU3MGQ0MTQyMmFjMDM5ZGY4NDNlOWQ1YjNlYjhiZDJmY2VkYWQ3YTY1MjI4N2QxYWNlNWYxMTQ3ODM3YzJjM2QzMmM5Yzg0MzUzZTViZmUxZmVkYjZlN2Y4MThmOTg5Y2RhOWMxZDMxYyJ9LHsibm9kZUlkIjoiMHhmREFFYWY3YWZDRmJiNGU0ZDE2REM2NmJEMjAzOWZkNjAwNENGY2U4IiwidHNNaWxsaXMiOjE3MjA2Mjk4MTAxMTcsInJhbmRvbUhleCI6IjQ5YjdlYzBlZDZjNzU2Zjg4NWIwYjYwZTkxZTBmYzBmNGM5ZDU1OTMiLCJwaW5nUmVzdWx0cyI6W3sibm9kZUlkIjoiMHg4ZTEyZEUxMkMzNWVBQmYzNWI1NmIwNEU1M0M0RTQ2OGU0NjcyN0U4IiwidHNNaWxsaXMiOjE3MjA2Mjk3ODAwOTUsInN0YXR1cyI6MX0seyJub2RlSWQiOiIweDk4RjlEOTEwQWVmOUIzQjlBNDUxMzdhZjFDQTc2NzVlRDkwYTUzNTUiLCJ0c01pbGxpcyI6MTcyMDYyOTc4MDA4MSwic3RhdHVzIjoxfV0sInNpZ25hdHVyZSI6IjB4OWY1ZWNiZjEyZjIwOTg2MmQzZDgwZTEwMmNkZjkzYzNkYzJhNTI1YTUxMzFiMWZhOWI2YzlkZTljNDg4NTUxMTZhZWUwNzYxNzRjY2Y2MzA2N2UxODFhODNhNGNkOGM0MjhiYzc2NDJkYWFjODU4YThlODZiY2YwYjk1OGJiNzgxYiJ9LHsibm9kZUlkIjoiMHg5OEY5RDkxMEFlZjlCM0I5QTQ1MTM3YWYxQ0E3Njc1ZUQ5MGE1MzU1IiwidHNNaWxsaXMiOjE3MjA2Mjk4MTAwODMsInJhbmRvbUhleCI6Ijg1NzkxYWEyNGMwZjJmMTU2M2Y2NTk4OTNlMjkyNzgxMzcxNjZjYjEiLCJwaW5nUmVzdWx0cyI6W3sibm9kZUlkIjoiMHg4ZTEyZEUxMkMzNWVBQmYzNWI1NmIwNEU1M0M0RTQ2OGU0NjcyN0U4IiwidHNNaWxsaXMiOjE3MjA2Mjk3ODAxNDYsInN0YXR1cyI6MX0seyJub2RlSWQiOiIweGZEQUVhZjdhZkNGYmI0ZTRkMTZEQzY2YkQyMDM5ZmQ2MDA0Q0ZjZTgiLCJ0c01pbGxpcyI6MTcyMDYyOTc4MDEyOSwic3RhdHVzIjoxfV0sInNpZ25hdHVyZSI6IjB4YmE2MzU1MjhiNmUxMWQ0N2I1YTA1NzlmZDgxZGNhMjFkMDIxMzdiZTQzYjhhY2QzN2EwMGFjYzc4YTQ1NWUyZDE4MDc3MTUwZDdjMWNkMzgyNzNhMTI1MjEzNWQyZjEyMGRiMmNiZjA5NjU4ZDkxZTMyYjZmZjdmOGQwYjhlYWYxYiJ9XX0=',
      validatorUrl: 'https://v1.push.org',
    }
    // const token = await this.pushValidator.call<TokenReply>('push_getApiToken')

    const txData: InitDidTxData = {
      did: bytesToHex(sha256(masterNode.publicKey as Uint8Array)),
      masterPubKey: bytesToHex(masterNode.publicKey as Uint8Array),
      derivedKeyIndex: derivedKey.index,
      derivedPubKey: derivedKey.publicKey,
      encDerivedPrivKey: JSON.stringify(encDerivedPrivKey),
    }
    const unsignedTx = PushTx.createTx(
      TxCategory.INIT_DID,
      [],
      txData,
      signer.source,
      utf8ToBytes(token.validatorToken)
    )

    // 4. Sign Serialized Unsigned Tx
    const serializedUnsignedTx = PushTx.serializeTx(unsignedTx)
    const signature = hexToBytes(
      (await signer.signMessage(bytesToHex(serializedUnsignedTx))).slice(2)
    )

    // 5. Serialize Tx
    const serializedSignedTx = PushTx.serializeTx({ ...unsignedTx, signature })

    // 6. Send Serialized Tx to Push Network
    // TODO: UNCOMMENT VALIDATOR CALL
    // await this.pushValidator.call(
    //   'push_sendTransaction',
    //   [serializedSignedTx],
    //   token.validatorUrl
    // )

    return {
      did: bytesToHex(sha256(masterNode.publicKey as Uint8Array)),
      mnemonic,
      derivedHDNode: HDKey.fromExtendedKey(derivedKey.privateExtendedKey),
    }
  }

  /**
   * Decrypts a Push Account
   * @param pushAccount Encrypted Push Account
   */
  private static decryptPushAccount = async (
    pushAccount: EncPushAccount,
    signer: Signer,
    mnemonic?: string
  ): Promise<DecPushAccount> => {
    let privateExtendedKey: string
    if (mnemonic) {
      privateExtendedKey = (
        await this.generateDerivedKey(mnemonic, pushAccount.derivedKeyIndex)
      ).privateExtendedKey
    } else {
      privateExtendedKey = (await PushEncryption.decrypt(
        JSON.parse(pushAccount.encDerivedPrivKey),
        signer
      )) as string
    }
    const derivedHDNode = HDKey.fromExtendedKey(privateExtendedKey)
    return {
      did: pushAccount.did,
      derivedHDNode,
      mnemonic,
    }
  }

  /**
   * Generates a random session key (hardened key) from derived key
   * @dev - To avoid any collisions ( theoretically ), no. of possible comb. = (2^31)^9
   */
  private generateRandomSessionKey = (): {
    privateKey: string | undefined
    publicKey: string | undefined
  } => {
    let derivedNode = this.derivedHDNode

    // Randomness = (2^31)^9
    const levels = 9
    for (let i = 0; i < levels; i++) {
      // Generate a random 32-bit index within the hardened range
      const randomBuffer = randomBytes(4)
      // Convert the buffer to an unsigned 32-bit integer (big-endian)
      const randomIndex =
        (randomBuffer[0] << 24) |
        (randomBuffer[1] << 16) |
        (randomBuffer[2] << 8) |
        randomBuffer[3]
      const hardenedIndex = randomIndex + 2 ** 31
      // Derive the next hardened child key
      derivedNode = derivedNode.deriveChild(hardenedIndex)
    }
    return {
      privateKey: derivedNode.privateKey?.toString(),
      publicKey: derivedNode.publicKey?.toString(),
    }
  }

  public addSessionKey = (origin: string | null = null) => {
    const sessionKeys = this.generateRandomSessionKey()
    console.log(origin, sessionKeys)
    // TODO: Create a AddSessionKey Tx
    // TODO: Sign Tx with derivedKey
    // TODO: Send Tx to vnodes
  }

  public revokeSessionKey = (publicKey: string) => {
    console.log(publicKey)
    // TODO: Create a RevokeSessionKey Tx
    // TODO: Sign Tx with derivedKey
    // TODO: Send Tx to vnodes
  }

  /**
   * Sign Data with Derived Key
   */
  public sign = (data: string, origin?: string): Uint8Array => {
    if (origin) {
      const appFound = this.appConnections.find(
        (each) => each.origin === origin
      )
      if (!appFound) throw new Error('App not Connected')
    }
    const hash = sha256(data)
    return this.derivedHDNode.sign(hash)
  }

  public ConnectionStatus = (
    origin: string
  ): { isConnected: boolean; isPending: boolean } => {
    const appFound = this.appConnections.find((each) => each.origin === origin)
    if (!appFound) {
      return { isConnected: false, isPending: false }
    } else {
      return { isConnected: !appFound.isPending, isPending: appFound.isPending }
    }
  }

  public requestToConnect = (origin: string) => {
    const appFound = this.appConnections.find((each) => each.origin === origin)
    if (!appFound) {
      this.appConnections.push({ origin, isPending: true })
    }
  }

  public acceptConnectionReq = (origin: string) => {
    const appFound = this.appConnections.find((each) => each.origin === origin)
    if (appFound) {
      appFound.isPending = false
    }
  }

  public rejectConnectionReq = (origin: string) => {
    this.appConnections = this.appConnections.filter(
      (each) => each.origin !== origin
    )
  }
}
