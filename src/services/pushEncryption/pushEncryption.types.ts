export type EncryptedPrivateKey = {
  ciphertext: string
  salt: string
  nonce: string
  version: ENCRYPTION_TYPE
  preKey: string
}

/**
 * SUPPORTED ENCRYPTIONS FOR PUSH KEYS
 */
export enum ENCRYPTION_TYPE {
  V1 = 'x25519-xsalsa20-poly1305',
  V2 = 'aes256GcmHkdfSha256',
  V3 = 'eip191-aes256-gcm-hkdf-sha256',
  V4 = 'pgpv1:nft',
  V5 = 'push:v5', // TODO: finalize naming
}
