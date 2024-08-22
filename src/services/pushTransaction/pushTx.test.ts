import { describe, it, expect } from 'vitest'
import { PushTx } from './pushTx'
import { TxCategory, InitDidTxData } from './pushTx.types'

// Mock data for testing
const mockInitDidTxData: InitDidTxData = {
  did: 'did:example:123',
  masterPubKey: 'master_pub_key',
  derivedKeyIndex: 0,
  derivedPubKey: 'derived_pub_key',
  encDerivedPrivKey: 'enc_derived_priv_key',
}

const mockRecipients = [
  'eip155:1:0x35B84d6848D16415177c64D64504663b998A6ab4',
  'eip155:97:0xD8634C39BBFd4033c0d3289C4515275102423681',
]
const mockSource = 'eip155:1'
const mockApiToken = new Uint8Array([1, 2, 3, 4, 5])

describe('PushTx', () => {
  it('should create an unsigned INIT_DID transaction', () => {
    const tx = PushTx.createTx(
      TxCategory.INIT_DID,
      mockRecipients,
      mockInitDidTxData,
      mockSource,
      mockApiToken
    )
    expect(tx).toEqual({
      type: 0,
      category: TxCategory.INIT_DID,
      source: mockSource,
      recipients: mockRecipients,
      data: mockInitDidTxData,
      salt: tx.salt,
      apiToken: mockApiToken,
      signature: new Uint8Array(0),
      fee: '0',
    })
  })

  it('should serialize an unsigned INIT_DID transaction', () => {
    const unsignedTx = PushTx.createTx(
      TxCategory.INIT_DID,
      mockRecipients,
      mockInitDidTxData,
      mockSource,
      mockApiToken
    )
    const serializedTx = PushTx.serializeTx(unsignedTx)
    expect(serializedTx).toBeInstanceOf(Uint8Array)
    expect(unsignedTx).toEqual(PushTx.deserializeTx(serializedTx))
  })

  it('should serialize a signed INIT_DID transaction', () => {
    const unsignedTx = PushTx.createTx(
      TxCategory.INIT_DID,
      mockRecipients,
      mockInitDidTxData,
      mockSource,
      mockApiToken
    )

    const signedTx = {
      ...unsignedTx,
      signature: new Uint8Array([6, 7, 8, 9, 10]),
    }

    const serializedTx = PushTx.serializeTx(signedTx)
    expect(serializedTx).toBeInstanceOf(Uint8Array)
    expect(signedTx).toEqual(PushTx.deserializeTx(serializedTx))
  })
})
