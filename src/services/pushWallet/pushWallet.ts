import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import { HDKey } from '@scure/bip32'
import { bytesToHex, hexToBytes, randomBytes } from '@noble/hashes/utils'
import {
  Validator as PushValidator,
  Tx as PushTx,
  Address,
} from '@pushprotocol/node-core'
import {
  InitDid,
  EncryptedText,
} from '@pushprotocol/node-core/src/lib/generated/txData/init_did'
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
import { mainnet } from 'viem/chains'

export class PushWallet {
  /*
    Purpose (44'): Specifies BIP-44.
    Coin Type (60'): Specifies Ethereum (60 is the coin type for Ethereum).
    Account Index (0'): Used to manage different accounts in the wallet.
    Change Index (0): 0 for external addresses, 1 for internal/change addresses.
    Address Index : Keeps incrementing for generating next accounts
  */
  private static rootPath = "m/44'/60'/0'/0"
  private static pushValidator: PushValidator
  private static unRegisteredProfile = false

  public appConnections: AppConnection[]
  public walletToEncDerivedKey: {
    [key: string]: {
      encDerivedPrivKey: EncryptedText
      signature: Uint8Array
    }
  } = {}

  private constructor(
    public did: string,
    public account: string,
    private derivedHDNode: HDKey,
    private env: ENV,
    public mnemonic: string | undefined = undefined
  ) {
    this.appConnections = []
  }

  public static signUp = async (env: ENV = ENV.STAGING) => {
    PushWallet.unRegisteredProfile = true
    const decryptedPushAccount = await PushWallet.generatePushAccount()
    // Encrypt Derived Keys with PushWallet's 1st Account Signer
    const account = mnemonicToAccount(decryptedPushAccount.mnemonic)
    const walletClient = createWalletClient({
      account,
      chain: mainnet,
      transport: http(),
    })
    const signer = await PushSigner.initialize(walletClient)
    signer.account = Address.toPushCAIP(
      mnemonicToAccount(decryptedPushAccount.mnemonic).address,
      env
    )
    const seed = await bip39.mnemonicToSeed(decryptedPushAccount.mnemonic)
    const masterNode = HDKey.fromMasterSeed(seed)
    const did = `PUSH_DID:${bytesToHex(sha256(masterNode.publicKey))}`
    const pushWalletInstance = new PushWallet(
      did,
      signer.account,
      decryptedPushAccount.derivedHDNode,
      env,
      decryptedPushAccount.mnemonic
    )
    pushWalletInstance.connectWalletWithAccount(signer)
    return pushWalletInstance
  }

  public static logInWithMnemonic = async (
    mnemonic: string,
    env: ENV = ENV.STAGING
  ) => {
    this.pushValidator = await PushValidator.initalize({ env })
    const pushCAIPAddress = Address.toPushCAIP(
      mnemonicToAccount(mnemonic).address,
      env
    )
    const encPushAccount = await PushWallet.getPushAccount(pushCAIPAddress)
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
        pushCAIPAddress,
        decryptedPushAccount.derivedHDNode,
        env,
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
        env,
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
    return await this.pushValidator.call<null | EncPushAccount>(
      'push_accountInfo',
      [account]
    )
  }

  /**
   * @description Derives a hardened key from master key
   * @param mnemonic
   * @param derivedKeyIndex - Useful in case of flushing keys
   * @param accountIndex - Might be useful when push wallet support multiple account
   */
  private static generateDerivedKey = async (
    mnemonic: string,
    derivedKeyIndex: number = 0,
    accountIndex: number = 0
  ): Promise<Key> => {
    const DERIVED_KEY_PATH = `${this.rootPath}/${accountIndex}/0'/${derivedKeyIndex}'`
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const masterNode = HDKey.fromMasterSeed(seed)
    const derivedNode = masterNode.derive(DERIVED_KEY_PATH)
    return {
      privateExtendedKey: derivedNode.privateExtendedKey, // pk + chainCode
      publicKey: bytesToHex(derivedNode.publicKey),
      index: derivedNode.index,
    }
  }

  private static generatePushAccount = async () => {
    // 1. Generate Mnemonic - 128 bit ( 12 words )
    const mnemonic = bip39.generateMnemonic(wordlist)
    // 2. Create Derived Keys
    const derivedKey = await this.generateDerivedKey(mnemonic)
    return {
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

  public connectWalletWithAccount = async (pushSigner: Signer) => {
    if (!PushWallet.unRegisteredProfile)
      throw Error('Only Allowed for Unregistered Profile')

    // 1. Encrypt Derived Priv Key with account
    const encDerivedPrivKey = await PushEncryption.encrypt(
      this.derivedHDNode.privateExtendedKey,
      pushSigner
    )

    // 2. Ask for confirmation signature - Serves as a conformation for user and proof for network
    const seed = await bip39.mnemonicToSeed(this.mnemonic as string)
    const masterNode = HDKey.fromMasterSeed(seed)
    const encDerivedPrivKeyHash = bytesToHex(
      sha256(JSON.stringify(encDerivedPrivKey))
    )
    const signature = await pushSigner.signMessage(
      `Connecting\n${pushSigner.account}\nTo\nPUSH_DID:${bytesToHex(
        sha256(masterNode.publicKey)
      )}\n\nProviding Access to Key with Identifier\n${encDerivedPrivKeyHash}`
    )

    // 3. Append details to Wallet Tx Payload
    this.walletToEncDerivedKey[pushSigner.account] = {
      encDerivedPrivKey: encDerivedPrivKey,
      signature: hexToBytes(signature.replace('0x', '')),
    }
  }

  public registerPushAccount = async () => {
    if (!PushWallet.unRegisteredProfile)
      throw Error('Only Allowed for Unregistered Profile')

    // 1. Create Init_did tx
    const seed = await bip39.mnemonicToSeed(this.mnemonic as string)
    const masterNode = HDKey.fromMasterSeed(seed)
    const txData: InitDid = {
      masterPubKey: bytesToHex(masterNode.publicKey as Uint8Array),
      derivedKeyIndex: this.derivedHDNode.index,
      derivedPubKey: bytesToHex(this.derivedHDNode.publicKey as Uint8Array),
      walletToEncDerivedKey: this.walletToEncDerivedKey,
    }
    const pushTx = await PushTx.initialize(this.env)
    const initDIDTx = pushTx.createUnsigned(
      'INIT_DID',
      [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      PushTx.serializeData(txData, 'INIT_DID' as any)
    )

    // 2. Send Tx
    await pushTx.send(initDIDTx, {
      sender: this.account,
      privKey: `0x${bytesToHex(masterNode.privateKey as Uint8Array)}`,
    })
    PushWallet.unRegisteredProfile = false
  }

  /**
   * SIGN DATA WITH DERIVED KEY
   * @param data data to be signed
   * @param origin origin from where the sig Req is incoming
   * @returns signature
   */
  public sign = (data: string, origin: string): `0x${string}` => {
    const appFound = this.appConnections.find((each) => each.origin === origin)
    if (!appFound) throw Error('App not Connected')
    const hash = sha256(data)
    const sigBytes = this.derivedHDNode.sign(hash)
    return `0x${bytesToHex(sigBytes)}`
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
