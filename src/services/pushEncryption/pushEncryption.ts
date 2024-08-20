import { Signer } from '../pushSigner/pushSigner.types'
import { hexToBytes, bytesToHex } from '@noble/hashes/utils'
import { EncryptedPrivateKey, ENCRYPTION_TYPE } from './pushEncryption.types'

export class PushEncryption {
  // TODO: Bring V1, V2, V4 schemes later ( Backward compatibility will be taken care later )

  private constructor(private signer: Signer) {}

  /**
   * Derive AES-256-GCM key from a shared secret and salt
   */
  private hkdf = async (
    secret: Uint8Array,
    salt: Uint8Array
  ): Promise<CryptoKey> => {
    const key = await crypto.subtle.importKey('raw', secret, 'HKDF', false, [
      'deriveKey',
    ])
    return crypto.subtle.deriveKey(
      { name: 'HKDF', hash: 'SHA-256', salt, info: new ArrayBuffer(0) },
      key,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * AES GCM Encryption
   * @param data data to be encrypted
   * @param secret secret used to encrypt the data
   * @param additionalData
   */
  private aesGcmEncryption = async (
    data: Uint8Array,
    secret: Uint8Array,
    additionalData?: Uint8Array
  ) => {
    const KDFSaltSize = 32 // bytes
    const AESGCMNonceSize = 12 // property iv
    const salt = crypto.getRandomValues(new Uint8Array(KDFSaltSize))
    const nonce = crypto.getRandomValues(new Uint8Array(AESGCMNonceSize))
    const key = await this.hkdf(secret, salt)

    const aesGcmParams: AesGcmParams = {
      name: 'AES-GCM',
      iv: nonce,
    }
    if (additionalData) {
      aesGcmParams.additionalData = additionalData
    }
    const encrypted: ArrayBuffer = await crypto.subtle.encrypt(
      aesGcmParams,
      key,
      data
    )
    return {
      ciphertext: bytesToHex(new Uint8Array(encrypted)),
      salt: bytesToHex(salt),
      nonce: bytesToHex(nonce),
    }
  }

  /**
   * AES GCM Decryption
   * @param encryptedData
   * @param secret secret used to encrypt the data
   * @param additionalData
   */
  private aesGcmDecryption = async (
    encryptedData: {
      ciphertext: string
      salt: string
      nonce: string
    },
    secret: Uint8Array,
    additionalData?: Uint8Array
  ): Promise<Uint8Array> => {
    const key = await this.hkdf(
      secret,
      hexToBytes(encryptedData.salt as string)
    )
    const aesGcmParams: AesGcmParams = {
      name: 'AES-GCM',
      iv: hexToBytes(encryptedData.nonce),
    }
    if (additionalData) {
      aesGcmParams.additionalData = additionalData
    }
    const decrypted: ArrayBuffer = await crypto.subtle.decrypt(
      aesGcmParams,
      key,
      hexToBytes(encryptedData.ciphertext)
    )
    return new Uint8Array(decrypted)
  }

  private encryptV3 = async (
    privateKey: string
  ): Promise<EncryptedPrivateKey> => {
    const input = bytesToHex(await crypto.getRandomValues(new Uint8Array(32)))
    const enableProfileMessage = 'Enable Push Profile \n' + input
    const secret =
      'eip191' + (await this.signer.signMessage(enableProfileMessage))
    const enc = new TextEncoder()
    const encodedPrivateKey = enc.encode(privateKey)
    const encryptedPrivateKey = await this.aesGcmEncryption(
      encodedPrivateKey,
      hexToBytes(secret)
    )
    return {
      ...encryptedPrivateKey,
      version: ENCRYPTION_TYPE.V3,
      preKey: input,
    }
  }

  private decryptV3 = async (
    encryptedPrivateKey: EncryptedPrivateKey
  ): Promise<string> => {
    const enableProfileMessage =
      'Enable Push Profile \n' + encryptedPrivateKey.preKey
    const secret =
      'eip191' + (await this.signer.signMessage(enableProfileMessage))
    const encodedPrivateKey = await this.aesGcmDecryption(
      encryptedPrivateKey,
      hexToBytes(secret)
    )
    const dec = new TextDecoder()
    return dec.decode(encodedPrivateKey)
  }

  public static encrypt = async (
    privateKey: string,
    signer: Signer,
    encryptionVersion: ENCRYPTION_TYPE = ENCRYPTION_TYPE.V3
  ) => {
    const pushEncryption = new PushEncryption(signer)
    switch (encryptionVersion) {
      // case ENCRYPTION_TYPE.V1: {
      //   break
      // }
      // case ENCRYPTION_TYPE.V2: {
      //   break
      // }
      case ENCRYPTION_TYPE.V3: {
        return pushEncryption.encryptV3(privateKey)
      }
      // case ENCRYPTION_TYPE.V4: {
      //   break
      // }
      default: {
        throw new Error('Invalid Key Encryption')
      }
    }
  }

  public static decrypt = async (
    encryptedPrivateKey: EncryptedPrivateKey,
    signer: Signer
  ) => {
    const pushEncryption = new PushEncryption(signer)
    switch (encryptedPrivateKey.version) {
      case ENCRYPTION_TYPE.V1: {
        break
      }
      case ENCRYPTION_TYPE.V2: {
        break
      }
      case ENCRYPTION_TYPE.V3: {
        return pushEncryption.decryptV3(encryptedPrivateKey)
      }
      case ENCRYPTION_TYPE.V4: {
        break
      }
      default: {
        throw new Error('Invalid Key Encryption')
      }
    }
  }
}
