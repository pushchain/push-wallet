import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { HDKey } from "@scure/bip32";
import { bytesToHex, utf8ToBytes, randomBytes } from "@noble/hashes/utils";
import {
  Validator as PushValidator,
  Tx as PushTx,
  Address,
} from "@pushprotocol/push-chain";

import {
  InitDid,
  EncryptedText,
} from "@pushprotocol/push-chain/src/lib/generated/txData/init_did";
import { EncPushAccount, AppConnection, AccountInfo } from "./pushWallet.types";
import { bytesToString, createWalletClient, hexToBytes, http } from "viem";
import { PushSigner } from "../pushSigner/pushSigner";
import { Signer } from "../pushSigner/pushSigner.types";
import { PushEncryption } from "../pushEncryption/pushEncryption";
import { sha256 } from "@noble/hashes/sha256";
import { ENV } from "../../constants";
import {
  hdKeyToAccount,
  mnemonicToAccount,
  privateKeyToAccount,
} from "viem/accounts";
import { mainnet } from "viem/chains";
import { EncryptedPrivateKey } from "../pushEncryption/pushEncryption.types";
import api from "../../services/api"; // Axios instance

export class PushWallet {
  private static pushValidator: PushValidator;
  private static unRegisteredProfile = false;
  /**
   * Address of Derived Key encoded in Push CAIP-10 format `push:network:pushconsumer...`
   * This is referred as Push Consumer Account, as it is used to sign all messages
   */
  public signerAccount: string;
  /**
   *  Array of URLs of Apps that are connected to the Push Wallet
   */
  public appConnections: AppConnection[];
  public attachedAccounts: string[] = [];
  /**
   * Accounts to Encrypted Derived Key Mapping
   * push_caip_account -> { encDerivedPrivKey, signature }    // 1st Account of Push Wallet
   * evm_caip_account -> { encDerivedPrivKey, signature }     // External ( OPTIONAL )
   * solana_caip_account -> { encDerivedPrivKey, signature }  // External ( OPTIONAL )
   * ... and so on
   */
  public walletToEncDerivedKey: {
    [key: string]: {
      encDerivedPrivKey: EncryptedText;
      signature: Uint8Array;
    };
  } = {};

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
        "pushconsumer"
      ) as `push${string}`,
      env
    );
    this.appConnections = localStorage.getItem("appConnections")
      ? JSON.parse(localStorage.getItem("appConnections"))
      : [];
  }

  public static signUp = async (env: ENV = ENV.STAGING) => {
    // 1. Mark Wallet as Unregistered
    PushWallet.unRegisteredProfile = true;
    // 2. Generate Push Wallet
    const pushWallet = await PushWallet.generatePushWallet();
    // 3. Generate 1st Push Account in CAIP-10 Format
    const account = Address.toPushCAIP(
      mnemonicToAccount(pushWallet.mnemonic).address,
      env
    );
    // 4. Initialize Push Wallet
    localStorage.removeItem("appConnections");
    const pushWalletInstance = new PushWallet(
      pushWallet.did,
      account,
      pushWallet.derivedNode,
      pushWallet.mnemonic,
      env
    );
    // 5. Encrypt Derived Keys with PushWallet's 1st Account
    const walletClient = createWalletClient({
      account: mnemonicToAccount(pushWallet.mnemonic),
      chain: mainnet,
      transport: http(),
    });
    const signer = await PushSigner.initialize(walletClient);
    signer.account = account; // Overwrite account with Push Wallet's 1st Account in CAIP-10 Format
    await pushWalletInstance.connectWalletWithAccount(signer);
    return pushWalletInstance;
  };

  public static logInWithMnemonic = async (
    mnemonic: string,
    env: ENV = ENV.STAGING
  ) => {
    // Generate 1st Push Account in CAIP-10 Format
    const account = Address.toPushCAIP(
      mnemonicToAccount(mnemonic).address,
      env
    );
    const walletClient = createWalletClient({
      account: mnemonicToAccount(mnemonic),
      chain: mainnet,
      transport: http(),
    });
    const signer = await PushSigner.initialize(walletClient);
    signer.account = account; // Overwrite account with Push Wallet's 1st Account in CAIP-10 Format
    return await PushWallet.loginWithWallet(signer, env);
  };

  public static loginWithWallet = async (
    pushSigner: Signer,
    env: ENV = ENV.STAGING
  ) => {
    this.pushValidator = await PushValidator.initalize({ env });
    const encPushAccount = await PushWallet.getPushWallet(pushSigner.account);
    console.log(encPushAccount);
    if (encPushAccount == null) {
      return null;
    } else {
      const derivedNode = await PushWallet.decryptDerivedNode(
        encPushAccount.encDerivedPrivKey,
        pushSigner
      );
      const pushWalletInstance = new PushWallet(
        encPushAccount.did,
        pushSigner.account,
        derivedNode,
        undefined,
        env
      );
      pushWalletInstance.attachedAccounts = encPushAccount.attachedaccounts;
      return pushWalletInstance;
    }
  };

  // TODO: Implement Later
  private static loginWithSocial = async () => {};

  /**
   * Get Push Wallet details from Push Network
   * @param account - account in CAIP-10 Format
   */
  private static getPushWallet = async (
    account: string
  ): Promise<null | EncPushAccount> => {
    const encPushAccount = await this.pushValidator.call<null | AccountInfo>(
      "push_accountInfo",
      [account]
    );
    return encPushAccount.items.length > 0
      ? {
          did: encPushAccount.items[0].did,
          derivedKeyIndex: parseInt(encPushAccount.items[0].derivedkeyindex),
          encDerivedPrivKey: {
            ...JSON.parse(encPushAccount.items[0].encryptedderivedprivatekey),
            preKey: JSON.parse(
              encPushAccount.items[0].encryptedderivedprivatekey
            ).prekey,
          },
          attachedaccounts: encPushAccount?.items[0]?.attachedaccounts?.map(
            (account) => account.address
          ),
        }
      : null;
  };

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
    const rootPath = "m/44'/60'/0'/0";
    const DERIVED_KEY_PATH = `${rootPath}/${accountIndex}/0'/${derivedKeyIndex}'`;
    return masterNode.derive(DERIVED_KEY_PATH);
  };

  private static generatePushWallet = async () => {
    // 1. Generate Mnemonic - 128 bit ( 12 words )
    const mnemonic = bip39.generateMnemonic(wordlist);
    // 2. Generate Master Node
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const masterNode = HDKey.fromMasterSeed(seed);
    // 3. Generate PUSH DID
    const did = `PUSH_DID:${bytesToHex(sha256(masterNode.publicKey))}`;
    // 4. Generate Derived Node
    const derivedNode = await this.generateDerivedNode(masterNode);
    return {
      mnemonic,
      masterNode,
      did,
      derivedNode,
    };
  };

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
    );
    return HDKey.fromExtendedKey(privateExtendedKey);
  };

  public connectWalletWithAccount = async (pushSigner: Signer) => {
    if (!PushWallet.unRegisteredProfile)
      throw Error("Only Allowed for Unregistered Profile");

    // 1. Encrypt Derived Priv Key with account
    const encDerivedPrivKey = await PushEncryption.encrypt(
      this.derivedHDNode.privateExtendedKey,
      pushSigner
    );
    // 2. Ask for confirmation signature - Serves as a conformation for user and proof for network
    const seed = await bip39.mnemonicToSeed(this.mnemonic as string);
    const masterNode = HDKey.fromMasterSeed(seed);
    const pushDID = `PUSH_DID:${bytesToHex(sha256(masterNode.publicKey))}`;
    const signature = await pushSigner.signMessage(
      `Connect Account To ${pushDID}`
    );

    // 3. Append details to Wallet Tx Payload
    this.walletToEncDerivedKey[pushSigner.account] = {
      encDerivedPrivKey: encDerivedPrivKey,
      signature,
    };
    this.attachedAccounts.push(pushSigner.account);
  };

  public registerPushAccount = async () => {
    if (!PushWallet.unRegisteredProfile)
      throw Error("Only Allowed for Unregistered Profile");

    // 1. Create Init_did tx
    const seed = await bip39.mnemonicToSeed(this.mnemonic as string);

    const masterNode = HDKey.fromMasterSeed(seed);
    const txData: InitDid = {
      masterPubKey: bytesToHex(masterNode.publicKey as Uint8Array),
      derivedKeyIndex: this.derivedHDNode.index,
      derivedPubKey: bytesToHex(this.derivedHDNode.publicKey as Uint8Array),
      walletToEncDerivedKey: this.walletToEncDerivedKey,
    };
    const pushTx = await PushTx.initialize(this.env);
    const initDIDTx = pushTx.createUnsigned(
      "INIT_DID",
      [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      PushTx.serializeData(txData, "INIT_DID" as any)
    );

    console.log("InitDIDTx:", initDIDTx);
    console.log(`0x${bytesToHex(masterNode.privateKey as Uint8Array)}`);

    // 2. Send Tx
    const account = privateKeyToAccount(
      `0x${bytesToHex(masterNode.privateKey as Uint8Array)}`
    );

    const signer = {
      account: Address.toPushCAIP(account.address, this.env),
      signMessage: async (dataToBeSigned: Uint8Array) => {
        const signature = await account.signMessage({
          message: { raw: dataToBeSigned },
        });
        return hexToBytes(signature);
      },
    };
    await pushTx.send(initDIDTx, signer);
    PushWallet.unRegisteredProfile = false;
  };

  public storeMnemonicShareAsEncryptedTx = async (
    userId: string,
    mnemonicShare: string,
    mnemonic: string
  ) => {
    try {
      // 1. Get registration options from server
      const response = await api.post("/auth/passkey/register-credential", {
        userId,
      });
      const options = response.data;

      // 2. Convert challenge and user ID to ArrayBuffer
      if (typeof options.publicKey.challenge === "string") {
        options.publicKey.challenge = PushWallet.base64URLToBuffer(
          options.publicKey.challenge
        );
      }

      if (typeof options.publicKey.user.id === "string") {
        options.publicKey.user.id = PushWallet.base64URLToBuffer(
          options.publicKey.user.id
        );
      }

      // 3. Create credential
      const credential = await navigator.credentials.create(options);

      if (!credential) {
        throw new Error("Failed to create PassKey credential");
      }

      // 4. Send credential to server for verification
      await api.post("/auth/passkey/verify-registration", {
        userId,
        credential: {
          id: (credential as PublicKeyCredential).id,
          rawId: PushWallet.bufferToBase64URL(
            (credential as PublicKeyCredential).rawId
          ),
          response: {
            attestationObject: PushWallet.bufferToBase64URL(
              (
                (credential as PublicKeyCredential)
                  .response as AuthenticatorAttestationResponse
              ).attestationObject
            ),
            clientDataJSON: PushWallet.bufferToBase64URL(
              (
                (credential as PublicKeyCredential)
                  .response as AuthenticatorAttestationResponse
              ).clientDataJSON
            ),
            transports:
              (
                (credential as PublicKeyCredential)
                  .response as AuthenticatorAttestationResponse
              ).getTransports?.() || [],
          },
          type: (credential as PublicKeyCredential).type,
          clientExtensionResults: (
            credential as PublicKeyCredential
          ).getClientExtensionResults(),
        },
      });

      // 4. Encrypt mnemonic share using the credential
      const subtle = window.crypto.subtle;
      const encoder = new TextEncoder();
      const data = encoder.encode(mnemonicShare);

      // Generate salt and derive encryption key
      const salt = new Uint8Array(16);
      window.crypto.getRandomValues(salt);

      const keyMaterial = await subtle.importKey(
        "raw",
        (credential as PublicKeyCredential).rawId,
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
      );

      const encryptionKey = await subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt.buffer,
          iterations: 100000,
          hash: { name: "SHA-256" },
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
      );

      // Encrypt the data
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedData = await subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        encryptionKey,
        data
      );

      // Combine salt and encrypted data
      const combinedData = new Uint8Array([
        ...salt,
        ...new Uint8Array(encryptedData),
      ]);

      // Do a Custom transaction on pushChain
      const txInstance = await PushTx.initialize(this.env);
      const recipients = [];
      const tx = txInstance.createUnsigned(
        "CUSTOM:MNEMONIC_SHARE_REGISTRATION",
        recipients,
        combinedData
      );

      const seed = await bip39.mnemonicToSeed(mnemonic as string);
      const masterNode = HDKey.fromMasterSeed(seed);

      const account = privateKeyToAccount(
        `0x${bytesToHex(masterNode.privateKey as Uint8Array)}`
      );

      const signer = {
        account: Address.toPushCAIP(account.address, this.env),
        signMessage: async (dataToBeSigned: Uint8Array) => {
          const signature = await account.signMessage({
            message: { raw: dataToBeSigned },
          });
          return hexToBytes(signature);
        },
      };

      const res = await txInstance.send(tx, signer);

      console.log("::::::::::::::::Tx Response::::::::::", res);
      await api.put(`/auth/passkey/transaction/${userId}`, {
        transactionHash: res,
        iv: PushWallet.bufferToBase64URL(iv),
      });
    } catch (error) {
      console.error("Error in sendMenomicShare:", error);
      throw error;
    }
  };

  public static async retrieveMnemonicShareFromTx(
    env: ENV,
    userId: string
  ): Promise<string> {
    try {
      const txDataResponse = await api.get(
        `/auth/passkey/transaction/${userId}`
      );
      if (!txDataResponse?.data?.transactionHash) {
        throw new Error("No transaction hash found");
      }

      // 2. Retrieve encrypted data from blockchain
      const txInstance = await PushTx.initialize(env);
      const txSearchResult = await txInstance.search(
        txDataResponse.data.transactionHash
      );

      const txData =
        txSearchResult.blocks[0]?.blockDataAsJson.txobjList[0]?.tx.data;
      if (!txData) {
        throw new Error("Transaction data not found");
      }

      // 3. Decode encrypted data from base64
      const encryptedData = new Uint8Array(
        atob(txData)
          .split("")
          .map((char) => char.charCodeAt(0))
      );

      // Get authentication challenge from server
      const challengeResponse = await api.get(
        `/auth/passkey/challenge/${userId}`
      );
      const options: PublicKeyCredentialRequestOptions = {
        challenge: this.base64URLToBuffer(challengeResponse.data.challenge),
        rpId: window.location.hostname,
        timeout: 60000,
        userVerification: "required",
        allowCredentials: [], // Server should provide the credential IDs
      };

      // Request PassKey authentication
      const credential = (await navigator.credentials.get({
        publicKey: options,
      })) as PublicKeyCredential;

      if (!credential) {
        throw new Error("Failed to get PassKey credential");
      }

      // 6. Extract components from encrypted data
      const salt = encryptedData.slice(0, 16);
      const iv = this.base64URLToBuffer(txDataResponse.data.iv);
      const actualEncryptedData = encryptedData.slice(16, -16);
      const authTag = encryptedData.slice(-16);
      const dataWithTag = new Uint8Array([...actualEncryptedData, ...authTag]);

      // 6. Derive decryption key
      const subtle = window.crypto.subtle;
      const keyMaterial = await subtle.importKey(
        "raw",
        credential.rawId,
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
      );

      const decryptionKey = await subtle.deriveKey(
        {
          name: "PBKDF2",
          salt,
          iterations: 100000,
          hash: { name: "SHA-256" },
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );

      // 7. Decrypt the data
      const decryptedBuffer = await subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        decryptionKey,
        dataWithTag.buffer
      );

      // 8. Convert decrypted buffer to string
      const decoder = new TextDecoder();
      const mnemonicShare = decoder.decode(decryptedBuffer);

      // Verify authentication with server
      await api.post(`/auth/passkey/verify/${userId}`, {
        id: credential.id,
        rawId: this.bufferToBase64URL(credential.rawId),
        authenticatorData: this.bufferToBase64URL(
          (credential.response as AuthenticatorAssertionResponse)
            .authenticatorData
        ),
        clientDataJSON: this.bufferToBase64URL(
          (credential.response as AuthenticatorAssertionResponse).clientDataJSON
        ),
        signature: this.bufferToBase64URL(
          (credential.response as AuthenticatorAssertionResponse).signature
        ),
        transactionHash: txDataResponse.data.transactionHash,
      });

      return mnemonicShare;
    } catch (error) {
      console.error("Error retrieving mnemonic share from transaction:", error);
      throw error;
    }
  }

  private static bufferToBase64URL(buffer: ArrayBuffer): string {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  private static base64URLToBuffer(base64URL: string): ArrayBuffer {
    const base64 = base64URL.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const binary = atob(paddedBase64);
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
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
    const appFound = this.appConnections.find((each) => each.origin === origin);
    if (!appFound) throw Error("App not Connected");
    const account = hdKeyToAccount(this.derivedHDNode);
    const client = createWalletClient({
      account,
      chain: mainnet,
      transport: http(),
    });
    const pushSigner = await PushSigner.initialize(client);
    return await pushSigner.signMessage(
      typeof data === "string" ? data : bytesToString(data)
    );
  };

  public ConnectionStatus = (
    origin: string
  ): { isConnected: boolean; isPending: boolean } => {
    const appFound = this.appConnections.find((each) => each.origin === origin);
    if (!appFound) {
      return { isConnected: false, isPending: false };
    } else {
      return {
        isConnected: !appFound.isPending,
        isPending: appFound.isPending,
      };
    }
  };

  public requestToConnect = (
    origin: string,
    onConnectionRequest: () => void
  ) => {
    const appFound = this.appConnections.find((each) => each.origin === origin);
    if (!appFound) {
      this.appConnections.push({ origin, isPending: true });
      onConnectionRequest();
      // Store updated appConnections in localStorage
      localStorage.setItem(
        "appConnections",
        JSON.stringify(this.appConnections)
      );
    }
  };

  public acceptConnectionReq = (origin: string) => {
    const appFound = this.appConnections.find((each) => each.origin === origin);
    if (appFound) {
      appFound.isPending = false;

      // Store updated appConnections in localStorage
      localStorage.setItem(
        "appConnections",
        JSON.stringify(this.appConnections)
      );
    }
  };

  public rejectConnectionReq = (origin: string) => {
    this.appConnections = this.appConnections.filter(
      (each) => each.origin !== origin
    );

    // Store updated appConnections in localStorage
    localStorage.setItem("appConnections", JSON.stringify(this.appConnections));
  };

  public rejectAllConnectionReqs = () => {
    this.appConnections = this.appConnections.filter(
      (app) => app.isPending === false
    );
    // Store updated appConnections in localStorage
    localStorage.setItem("appConnections", JSON.stringify(this.appConnections));
  };

  /**
   * Generates a random session key (hardened key) from derived key
   * @dev - To avoid any collisions ( theoretically ), no. of possible comb. = (2^31)^9
   */
  private generateRandomSessionKey = (): {
    privateKey: string | undefined;
    publicKey: string | undefined;
  } => {
    let derivedNode = this.derivedHDNode;

    // Randomness = (2^31)^9
    const levels = 9;
    for (let i = 0; i < levels; i++) {
      // Generate a random 32-bit index within the hardened range
      const randomBuffer = randomBytes(4);
      // Convert the buffer to an unsigned 32-bit integer (big-endian)
      const randomIndex =
        (randomBuffer[0] << 24) |
        (randomBuffer[1] << 16) |
        (randomBuffer[2] << 8) |
        randomBuffer[3];
      const hardenedIndex = randomIndex + 2 ** 31;
      // Derive the next hardened child key
      derivedNode = derivedNode.deriveChild(hardenedIndex);
    }
    return {
      privateKey: derivedNode.privateKey?.toString(),
      publicKey: derivedNode.publicKey?.toString(),
    };
  };

  // TODO: Implement Later
  public addSessionKey = (origin: string | null = null) => {
    const sessionKeys = this.generateRandomSessionKey();
    console.log(origin, sessionKeys);
    // TODO: Create a AddSessionKey Tx
    // TODO: Sign Tx with derivedKey
    // TODO: Send Tx to vnodes
  };

  // TODO: Implement Later
  public revokeSessionKey = (publicKey: string) => {
    console.log(publicKey);
    // TODO: Create a RevokeSessionKey Tx
    // TODO: Sign Tx with derivedKey
    // TODO: Send Tx to vnodes
  };
}
