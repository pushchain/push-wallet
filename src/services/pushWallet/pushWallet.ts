import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import { HDKey } from '@scure/bip32'
import { bytesToHex, randomBytes } from '@noble/hashes/utils'
import {
  Validator as PushValidator,
  Tx as PushTx,
} from '@pushprotocol/node-core'
import { TxCategory } from '@pushprotocol/node-core/src/lib/tx/tx.types'
import { InitDid } from '@pushprotocol/node-core/src/lib/generated/txData/init_did'
import {
  Key,
  EncPushAccount,
  DecPushAccount,
  AppConnection,
} from './pushWallet.types'
import { createWalletClient, http, WalletClient } from 'viem'
import { PushSigner } from '../pushSigner/pushSigner'
import { Signer } from '../pushSigner/pushSigner.types'
import { PushEncryption } from '../pushEncryption/pushEncryption'
import { sha256 } from '@noble/hashes/sha256'
import { ENV } from '../../constants'
import { mnemonicToAccount } from 'viem/accounts'

export class PushWallet {
  /*
    Purpose (44'): Specifies BIP-44.
    Coin Type (60'): Specifies Ethereum (60 is the coin type for Ethereum).
    Account (0'): Used to manage different accounts in the wallet.
    Change (0): 0 for external addresses, 1 for internal/change addresses.
  */
  private static rootPath: `m/44'/60'/${string}` = "m/44'/60'/0'"
  private static pushValidator: PushValidator
  private static unRegisteredProfile = false
  private static walletToEncDerivedKey: { [key: string]: string } = {}

  public appConnections: AppConnection[]

  private constructor(
    public did: string,
    public account: string,
    private derivedHDNode: HDKey,
    private mnemonic: string | undefined = undefined
  ) {
    this.appConnections = []
  }

  public static signUp = async () => {
    PushWallet.unRegisteredProfile = true
    const decryptedPushAccount = await PushWallet.generatePushAccount()
    return new PushWallet(
      decryptedPushAccount.did,
      mnemonicToAccount(decryptedPushAccount.mnemonic).address,
      decryptedPushAccount.derivedHDNode,
      decryptedPushAccount.mnemonic
    )
  }

  public static logInWithMnemonic = async (
    mnemonic: string,
    env: ENV = ENV.STAGING
  ) => {
    this.pushValidator = await PushValidator.initalize({ env })
    const account = mnemonicToAccount(mnemonic)
    // TODO: Change this to encoded Push Address
    const encPushAccount = await PushWallet.getPushAccount(account.address)
    if (encPushAccount == null) {
      throw Error('Push Account Not Found!')
    } else {
      const decryptedPushAccount = await PushWallet.decryptPushAccount(
        encPushAccount,
        undefined,
        mnemonic
      )
      return new PushWallet(
        decryptedPushAccount.did,
        account.address,
        decryptedPushAccount.derivedHDNode,
        decryptedPushAccount.mnemonic
      )
    }
  }

  public static loginWithWallet = async (
    walletClient: WalletClient,
    env: ENV = ENV.STAGING
  ) => {
    this.pushValidator = await PushValidator.initalize({ env })
    const pushSigner = await PushSigner.initialize(walletClient)
    const encPushAccount = await PushWallet.getPushAccount(pushSigner.account)
    if (encPushAccount == null) {
      throw Error('Push Account Not Found!')
    } else {
      const decryptedPushAccount = await PushWallet.decryptPushAccount(
        encPushAccount,
        pushSigner
      )
      return new PushWallet(
        decryptedPushAccount.did,
        pushSigner.account,
        decryptedPushAccount.derivedHDNode,
        decryptedPushAccount.mnemonic
      )
    }
  }

  // TODO: Implement Later
  private static loginWithSocial = async () => {}

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

  private static generatePushAccount = async () => {
    // 1. Generate Mnemonic
    const mnemonic = bip39.generateMnemonic(wordlist) // 128 bit ( 12 words )
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const masterNode = HDKey.fromMasterSeed(seed)
    // 2. Create Derived Keys
    const derivedKey = await this.generateDerivedKey(mnemonic)
    // 3. Encrypt Derived Keys with PushWallet's 1st Account Signer
    const account = mnemonicToAccount(mnemonic)
    const walletClient = createWalletClient({ account, transport: http() })
    const signer = await PushSigner.initialize(walletClient)
    const encDerivedPrivKey = await PushEncryption.encrypt(
      derivedKey.privateExtendedKey,
      signer
    )
    // TODO: Change this to encoded Push Address
    PushWallet.walletToEncDerivedKey[signer.account] =
      JSON.stringify(encDerivedPrivKey)
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
    signer: Signer | undefined = undefined,
    mnemonic: string | undefined = undefined
  ): Promise<DecPushAccount> => {
    let privateExtendedKey: string
    if (mnemonic) {
      privateExtendedKey = (
        await this.generateDerivedKey(mnemonic, pushAccount.derivedKeyIndex)
      ).privateExtendedKey
    } else if (signer) {
      privateExtendedKey = (await PushEncryption.decrypt(
        JSON.parse(pushAccount.encDerivedPrivKey),
        signer
      )) as string
    } else {
      throw Error('Unable to Decrypt Push Account without Signer or Mnemonic!')
    }
    const derivedHDNode = HDKey.fromExtendedKey(privateExtendedKey)
    return {
      did: pushAccount.did,
      derivedHDNode,
      mnemonic,
    }
  }

  public connectWalletWithAccount = async (signer: WalletClient) => {
    if (!PushWallet.unRegisteredProfile)
      throw Error('Only Allowed for Unregistered Profile')
    const pushSigner = await PushSigner.initialize(signer)
    const encDerivedPrivKey = await PushEncryption.encrypt(
      this.derivedHDNode.privateExtendedKey,
      pushSigner
    )
    PushWallet.walletToEncDerivedKey[pushSigner.account] =
      JSON.stringify(encDerivedPrivKey)
  }

  public registerPushAccount = async (env: ENV = ENV.STAGING) => {
    if (!PushWallet.unRegisteredProfile)
      throw Error('Only Allowed for Unregistered Profile')
    // 1. Create Init_did tx
    const seed = await bip39.mnemonicToSeed(this.mnemonic as string)
    const masterNode = HDKey.fromMasterSeed(seed)
    const txData: InitDid = {
      did: bytesToHex(sha256(masterNode.publicKey as Uint8Array)),
      masterPubKey: bytesToHex(masterNode.publicKey as Uint8Array),
      derivedKeyIndex: this.derivedHDNode.index,
      derivedPubKey: bytesToHex(this.derivedHDNode.publicKey as Uint8Array),
      walletToEncDerivedKey: PushWallet.walletToEncDerivedKey,
    }
    const pushTx = await PushTx.initialize(env)
    const initDIDTx = await pushTx.createUnsigned(
      TxCategory.INIT_DID,
      [],
      PushTx.serializeData(txData, TxCategory.INIT_DID)
    )
    // 2. Send Tx
    await pushTx.send(initDIDTx)
    PushWallet.walletToEncDerivedKey = {}
    PushWallet.unRegisteredProfile = false
  }

  /**
   * SIGN DATA WITH DERIVED KEY
   * @param data data to be signed
   * @param origin origin from where the sig Req is incoming
   * @returns signature
   */
  public sign = (data: string, origin: string): Uint8Array => {
    const appFound = this.appConnections.find((each) => each.origin === origin)
    if (!appFound) throw Error('App not Connected')
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

  // TODO: Implement Later
  public addSessionKey = (origin: string | null = null) => {
    const sessionKeys = this.generateRandomSessionKey()
    console.log(origin, sessionKeys)
    // TODO: Create a AddSessionKey Tx
    // TODO: Sign Tx with derivedKey
    // TODO: Send Tx to vnodes
  }

  // TODO: Implement Later
  public revokeSessionKey = (publicKey: string) => {
    console.log(publicKey)
    // TODO: Create a RevokeSessionKey Tx
    // TODO: Sign Tx with derivedKey
    // TODO: Send Tx to vnodes
  }
}
