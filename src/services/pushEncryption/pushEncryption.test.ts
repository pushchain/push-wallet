/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeAll } from 'vitest'
import { PushEncryption } from './pushEncryption'
import { ENCRYPTION_TYPE, EncryptedPrivateKey } from './pushEncryption.types'
import { Signer } from '../pushSigner/pushSigner.types'
import { createWalletClient, http } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { PushSigner } from '../pushSigner/pushSigner'
// import { bytesToHex, hexToBytes as h1 } from '@noble/hashes/utils'
// import {
//   hexToBytes as h2,
//   bytesToHex as b1,
//   base16ToBytes,
//   bytesToBase16,
// } from '../../utils'
// import { hexToBytes as h3, bytesToHex as b2 } from 'viem'

describe('(PushEncryption as any)', () => {
  let signer: Signer

  beforeAll(async () => {
    const walletClient = createWalletClient({
      account: privateKeyToAccount(generatePrivateKey()),
      chain: sepolia,
      transport: http(),
    })
    signer = await PushSigner.initialize(walletClient)
  })

  describe('hkdf', () => {
    it('should derive a valid AES key from a shared secret and salt', async () => {
      const secret = new Uint8Array(32)
      const salt = new Uint8Array(32)
      const pushEncryption = new (PushEncryption as any)(signer)
      const key = await pushEncryption['hkdf'](secret, salt)

      expect(key).toBeDefined()
      expect(key.algorithm.name).toBe('AES-GCM')
    })
  })

  describe('aesGcmEncryption', () => {
    it('should return a valid ciphertext, salt, and nonce', async () => {
      const data = new Uint8Array([1, 2, 3, 4])
      const secret = new Uint8Array(32)
      const pushEncryption = new (PushEncryption as any)(signer)
      const result = await pushEncryption['aesGcmEncryption'](data, secret)

      expect(result.ciphertext).toBeDefined()
      expect(result.salt).toBeDefined()
      expect(result.nonce).toBeDefined()
    })

    it('should correctly handle encryption without additional data', async () => {
      const data = new Uint8Array([1, 2, 3, 4])
      const secret = new Uint8Array(32)
      const pushEncryption = new (PushEncryption as any)(signer)
      const result = await pushEncryption['aesGcmEncryption'](data, secret)

      expect(result.ciphertext).toBeDefined()
      expect(result.salt).toBeDefined()
      expect(result.nonce).toBeDefined()
    })
  })

  describe('aesGcmDecryption', () => {
    it('should correctly decrypt ciphertext to return the original data', async () => {
      const data = new Uint8Array([1, 2, 3, 4])
      const secret = new Uint8Array(32)
      const pushEncryption = new (PushEncryption as any)(signer)
      const encrypted = await pushEncryption['aesGcmEncryption'](data, secret)
      const decrypted = await pushEncryption['aesGcmDecryption'](
        {
          ciphertext: encrypted.ciphertext,
          salt: encrypted.salt,
          nonce: encrypted.nonce,
          version: ENCRYPTION_TYPE.V5,
          preKey: 'mockPreKey',
        },
        secret
      )

      expect(decrypted).toEqual(data)
    })

    it('should throw an error when given incorrect ciphertext or secret', async () => {
      const incorrectSecret = new Uint8Array(32)
      const pushEncryption = new (PushEncryption as any)(signer)
      const encrypted = {
        ciphertext: 'incorrectCiphertext',
        salt: 'incorrectSalt',
        nonce: 'incorrectNonce',
        version: ENCRYPTION_TYPE.V5,
        preKey: 'mockPreKey',
      }

      await expect(
        pushEncryption['aesGcmDecryption'](encrypted, incorrectSecret)
      ).rejects.toThrow()
    })
  })

  describe('encryptV5', () => {
    it('should return a valid EncryptedPrivateKey object', async () => {
      const privateKey = '0x1'
      const pushEncryption = new (PushEncryption as any)(signer)
      const result = await pushEncryption.encryptV5(privateKey)

      expect(result).toBeDefined()
      expect(result.ciphertext).toBeDefined()
      expect(result.salt).toBeDefined()
      expect(result.nonce).toBeDefined()
      expect(result.version).toBe(ENCRYPTION_TYPE.V5)
    })
  })

  describe('decryptV5', () => {
    it('should correctly decrypt an EncryptedPrivateKey object to return the original private key', async () => {
      const privateKey = '0x1'
      const pushEncryption = new (PushEncryption as any)(signer)
      const encryptedPrivateKey = await pushEncryption.encryptV5(privateKey)
      const decryptedKey = await pushEncryption.decryptV5(encryptedPrivateKey)
      expect(decryptedKey).toBe(privateKey)
    })

    it('should throw an error when attempting to decrypt with an invalid signer', async () => {
      const invalidSigner: Signer = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        signMessage: async (dataToBeSigned: string) => 'invalidSignature',
        account: 'fake',
        source: 'fake',
      }
      const privateKey = 'mockPrivateKey'
      const pushEncryption = new (PushEncryption as any)(signer)
      const encryptedPrivateKey = await pushEncryption.encryptV5(privateKey)

      const invalidPushEncryption = new (PushEncryption as any)(invalidSigner)
      await expect(
        invalidPushEncryption.decryptV5(encryptedPrivateKey)
      ).rejects.toThrow()
    })
  })

  describe('encrypt', () => {
    it('should correctly dispatch encryption to encryptV5 for V5 encryption type', async () => {
      const privateKey = 'mockPrivateKey'
      const result = await (PushEncryption as any).encrypt(
        privateKey,
        signer,
        ENCRYPTION_TYPE.V5
      )

      expect(result).toBeDefined()
      expect(result.version).toBe(ENCRYPTION_TYPE.V5)
    })

    it('should throw an error for an unsupported encryption version', async () => {
      const privateKey = 'mockPrivateKey'

      await expect(
        (PushEncryption as any).encrypt(
          privateKey,
          signer,
          'unsupported_version' as any
        )
      ).rejects.toThrow('Invalid Key Encryption')
    })
  })

  describe('decrypt', () => {
    it('should correctly dispatch decryption to decryptV5 for V5 encryption type', async () => {
      const privateKey = 'mockPrivateKey'
      const encryptedPrivateKey = await (PushEncryption as any).encrypt(
        privateKey,
        signer,
        ENCRYPTION_TYPE.V5
      )
      const decryptedKey = await (PushEncryption as any).decrypt(
        encryptedPrivateKey,
        signer
      )

      expect(decryptedKey).toBe(privateKey)
    })

    it('should throw an error for an unsupported decryption version', async () => {
      const encryptedPrivateKey: EncryptedPrivateKey = {
        ciphertext: 'mockCiphertext',
        salt: 'mockSalt',
        nonce: 'mockNonce',
        version: 'unsupported_version' as any,
        preKey: 'mockPreKey',
      }

      await expect(
        (PushEncryption as any).decrypt(encryptedPrivateKey, signer)
      ).rejects.toThrow('Invalid Key Encryption')
    })
  })

  //   it.only('test', async () => {
  //     const sig = await signer.signMessage('Hey')
  //     console.log(sig)
  //     console.log(base16ToBytes(sig.slice(2)))
  //     console.log(bytesToBase16(base16ToBytes(sig.slice(2))))
  //     // console.log(h1(sig.slice(2)))
  //     // console.log(h2(sig))
  //     // console.log(h3(sig))
  //     // console.log(bytesToHex(h1(sig.slice(2))))
  //     // console.log(bytesToHex(h2(sig)))
  //     // console.log(b1(h1(sig.slice(2))))
  //     // console.log(b1(h2(sig)))
  //     // console.log(b2(h3(sig)))
  //   })
})
