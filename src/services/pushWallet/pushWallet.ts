import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import { HDKey } from '@scure/bip32'
import { bytesToHex, randomBytes } from '@noble/hashes/utils'
import {
  Validator as PushValidator,
  Tx as PushTx,
  Address,
} from '@pushprotocol/node-core'
import {
  InitDid,
  EncryptedText,
} from '@pushprotocol/node-core/src/lib/generated/txData/init_did'
import { EncPushAccount, AppConnection } from './pushWallet.types'
import { bytesToString, createWalletClient, hexToBytes, http } from 'viem'
import { PushSigner } from '../pushSigner/pushSigner'
import { Signer } from '../pushSigner/pushSigner.types'
import { PushEncryption } from '../pushEncryption/pushEncryption'
import { sha256 } from '@noble/hashes/sha256'
import { ENV } from '../../constants'
import {
  hdKeyToAccount,
  mnemonicToAccount,
  privateKeyToAccount,
} from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { EncryptedPrivateKey } from '../pushEncryption/pushEncryption.types'

export class PushWallet {
  private static pushValidator: PushValidator
  private static unRegisteredProfile = false
  /**
   * Address of Derived Key encoded in Push CAIP-10 format `push:network:pushconsumer...`
   * This is referred as Push Consumer Account, as it is used to sign all messages
   */
  public signerAccount: string
  /**
   *  Array of URLs of Apps that are connected to the Push Wallet
   */
  public appConnections: AppConnection[]
  /**
   * Accounts to Encrypted Derived Key Mapping
   * push_caip_account -> { encDerivedPrivKey, signature }    // 1st Account of Push Wallet
   * evm_caip_account -> { encDerivedPrivKey, signature }     // External ( OPTIONAL )
   * solana_caip_account -> { encDerivedPrivKey, signature }  // External ( OPTIONAL )
   * ... and so on
   */
  public walletToEncDerivedKey: {
    [key: string]: {
      encDerivedPrivKey: EncryptedText
      signature: Uint8Array
    }
  } = {}

  private constructor(
    /**
     * Decentralized Identifier of the Push Wallet used to map multiple accounts to the same DID
     * Format: `PUSH_DID:SHA256hash`
     * This should not be visible to the user as it is used for internal mapping
     */
    private did: string,
    /**
     * 1st Account of Push Wallet when created or Web3 Account used to login to Push Wallet
     * In CAIP-10 Format
     */
    public account: string,
    private derivedHDNode: HDKey,
    /**
     * TODO: Encrypt Mnemonic
     * Encrypted Mnemonic of the Push Wallet
     * Encryption is done via PIN / Password / PassKey
     * In case of login via Web3 Account, this field is undefined
     */
    public mnemonic: string | undefined = undefined,
    private env: ENV
  ) {
    this.signerAccount = Address.toPushCAIP(
      Address.evmToPush(
        hdKeyToAccount(derivedHDNode).address,
        'pushconsumer'
      ) as `push${string}`,
      env
    )
    this.appConnections = localStorage.getItem('appConnections')
      ? JSON.parse(localStorage.getItem('appConnections'))
      : []
  }

  public static signUp = async (env: ENV = ENV.STAGING) => {
    // 1. Mark Wallet as Unregistered
    PushWallet.unRegisteredProfile = true
    // 2. Generate Push Wallet
    const pushWallet = await PushWallet.generatePushWallet()
    // 3. Generate 1st Push Account in CAIP-10 Format
    const account = Address.toPushCAIP(
      mnemonicToAccount(pushWallet.mnemonic).address,
      env
    )
    // 4. Initialize Push Wallet
    localStorage.removeItem('appConnections')
    const pushWalletInstance = new PushWallet(
      pushWallet.did,
      account,
      pushWallet.derivedNode,
      pushWallet.mnemonic,
      env
    )
    // 5. Encrypt Derived Keys with PushWallet's 1st Account
    const walletClient = createWalletClient({
      account: mnemonicToAccount(pushWallet.mnemonic),
      chain: mainnet,
      transport: http(),
    })
    const signer = await PushSigner.initialize(walletClient)
    signer.account = account // Overwrite account with Push Wallet's 1st Account in CAIP-10 Format
    await pushWalletInstance.connectWalletWithAccount(signer)
    return pushWalletInstance
  }

  public static logInWithMnemonic = async (
    mnemonic: string,
    env: ENV = ENV.STAGING
  ) => {
    // Generate 1st Push Account in CAIP-10 Format
    const account = Address.toPushCAIP(mnemonicToAccount(mnemonic).address, env)
    const walletClient = createWalletClient({
      account: mnemonicToAccount(mnemonic),
      chain: mainnet,
      transport: http(),
    })
    const signer = await PushSigner.initialize(walletClient)
    signer.account = account // Overwrite account with Push Wallet's 1st Account in CAIP-10 Format
    return await PushWallet.loginWithWallet(signer, env)
  }

  public static loginWithWallet = async (
    pushSigner: Signer,
    env: ENV = ENV.STAGING
  ) => {
    this.pushValidator = await PushValidator.initalize({ env })
    const encPushAccount = await PushWallet.getPushWallet(pushSigner.account)
    if (encPushAccount == null) {
      throw Error('Push Account Not Found!')
    } else {
      const derivedNode = await PushWallet.decryptDerivedNode(
        encPushAccount.encDerivedPrivKey,
        pushSigner
      )
      return new PushWallet(
        encPushAccount.did,
        pushSigner.account,
        derivedNode,
        undefined,
        env
      )
    }
  }

  // TODO: Implement Later
  private static loginWithSocial = async () => {}

  /**
   * Get Push Wallet details from Push Network
   * @param account - account in CAIP-10 Format
   */
  private static getPushWallet = async (
    account: string
  ): Promise<null | EncPushAccount> => {
    const encPushAccount = localStorage.getItem(account)
    if (encPushAccount) {
      return JSON.parse(encPushAccount)
    }
    return await this.pushValidator.call<null | EncPushAccount>(
      'push_accountInfo',
      [account]
    )
  }

  /**
   * @description Derives a hardened key from master key
   * @param masterNode
   * @param derivedKeyIndex - Useful in case of flushing keys
   * @param accountIndex - Might be useful when push wallet support multiple account
   */
  private static generateDerivedNode = async (
    masterNode: HDKey,
    derivedKeyIndex: number = 0,
    accountIndex: number = 0
  ): Promise<HDKey> => {
    /*
    Purpose (44'): Specifies BIP-44.
    Coin Type (60'): Specifies Ethereum (60 is the coin type for Ethereum).
    Account Index (0'): Used to manage different accounts in the wallet.
    Change Index (0): 0 for external addresses, 1 for internal/change addresses.
    Address Index : Keeps incrementing for generating next accounts
  */
    const rootPath = "m/44'/60'/0'/0"
    const DERIVED_KEY_PATH = `${rootPath}/${accountIndex}/0'/${derivedKeyIndex}'`
    return masterNode.derive(DERIVED_KEY_PATH)
  }

  private static generatePushWallet = async () => {
    // 1. Generate Mnemonic - 128 bit ( 12 words )
    const mnemonic = bip39.generateMnemonic(wordlist)
    // 2. Generate Master Node
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const masterNode = HDKey.fromMasterSeed(seed)
    // 3. Generate PUSH DID
    const did = `PUSH_DID:${bytesToHex(sha256(masterNode.publicKey))}`
    // 4. Generate Derived Node
    const derivedNode = await this.generateDerivedNode(masterNode)
    return {
      mnemonic,
      masterNode,
      did,
      derivedNode,
    }
  }

  /**
   * Decrypts a Derived Key using Signer
   */
  private static decryptDerivedNode = async (
    encDerivedPrivKey: EncryptedPrivateKey,
    signer: Signer
  ): Promise<HDKey> => {
    const privateExtendedKey = await PushEncryption.decrypt(
      encDerivedPrivKey,
      signer
    )
    return HDKey.fromExtendedKey(privateExtendedKey)
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
    const pushDID = `PUSH_DID:${bytesToHex(sha256(masterNode.publicKey))}`
    const signature = await pushSigner.signMessage(
      `Connect Account To ${pushDID}`
    )

    // 3. Append details to Wallet Tx Payload
    this.walletToEncDerivedKey[pushSigner.account] = {
      encDerivedPrivKey: encDerivedPrivKey,
      signature,
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

    console.log('InitDIDTx:', initDIDTx)
    console.log(`0x${bytesToHex(masterNode.privateKey as Uint8Array)}`)

    // 2. Send Tx
    const account = privateKeyToAccount(
      `0x${bytesToHex(masterNode.privateKey as Uint8Array)}`
    )

    const signer = {
      account: Address.toPushCAIP(account.address, this.env),
      signMessage: async (dataToBeSigned: Uint8Array) => {
        const signature = await account.signMessage({
          message: { raw: dataToBeSigned },
        })
        return hexToBytes(signature)
      },
    }
    await pushTx.send(initDIDTx, signer)
    PushWallet.unRegisteredProfile = false

    Object.keys(this.walletToEncDerivedKey).forEach((key) => {
      const { encDerivedPrivKey } = this.walletToEncDerivedKey[key]

      localStorage.setItem(
        key,
        JSON.stringify({ did: this.did, derivedKeyIndex: 0, encDerivedPrivKey })
      )
    })
  }

  /**
   * SIGN DATA WITH DERIVED KEY
   * @param data data to be signed
   * @param origin origin from where the sig Req is incoming
   * @returns signature
   */
  public sign = async (
    data: string | Uint8Array,
    origin: string
  ): Promise<Uint8Array> => {
    const appFound = this.appConnections.find((each) => each.origin === origin)
    if (!appFound) throw Error('App not Connected')
    const account = hdKeyToAccount(this.derivedHDNode)
    const client = createWalletClient({
      account,
      chain: mainnet,
      transport: http(),
    })
    const pushSigner = await PushSigner.initialize(client)
    return await pushSigner.signMessage(
      typeof data === 'string' ? data : bytesToString(data)
    )
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

      // Store updated appConnections in localStorage
      localStorage.setItem(
        'appConnections',
        JSON.stringify(this.appConnections)
      )
    }
  }

  public acceptConnectionReq = (origin: string) => {
    const appFound = this.appConnections.find((each) => each.origin === origin)
    if (appFound) {
      appFound.isPending = false

      // Store updated appConnections in localStorage
      localStorage.setItem(
        'appConnections',
        JSON.stringify(this.appConnections)
      )
    }
  }

  public rejectConnectionReq = (origin: string) => {
    this.appConnections = this.appConnections.filter(
      (each) => each.origin !== origin
    )

    // Store updated appConnections in localStorage
    localStorage.setItem('appConnections', JSON.stringify(this.appConnections))
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
