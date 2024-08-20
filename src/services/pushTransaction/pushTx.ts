import { uuid } from 'uuidv4'
import { UnsignedTx, TxCategory, SignedTx, InitDidTxData } from './pushTx.types'
import { Tx } from '../../generated/tx/v1/tx_pb'
import { InitDid } from '../../generated/tx/v1/txData/init_did_pb'

export class PushTx {
  /**
   * Create an Unsigned Tx
   * @param category Tx category
   * @param recipients Tx recipients
   * @param data Tx payload data
   * @param source Sender's source chain
   * @returns Unsigned Tx
   */
  static createTx = (
    category: TxCategory,
    recipients: string[],
    data: UnsignedTx['data'],
    source: string,
    apiToken: string
  ): UnsignedTx => {
    return {
      type: 0, // Phase 0 only has non-value transfers
      category,
      source,
      recipients,
      data,
      salt: uuid(),
      apiToken,
      fee: '0', // Fee is 0 as of now
    }
  }

  static serializeTx = (tx: UnsignedTx | SignedTx): Uint8Array => {
    const transaction = new Tx()
    transaction.setType(tx.type)
    transaction.setCategory(tx.category)
    transaction.setSource(tx.source)
    transaction.setRecipientsList(tx.recipients)
    transaction.setData(PushTx.serializeTxData(tx.data, tx.category))
    transaction.setSalt(tx.salt)
    transaction.setApitoken(tx.apiToken)
    if ((tx as SignedTx).signature) {
      transaction.setSignature((tx as SignedTx).signature)
    }
    transaction.setFee(tx.fee)
    return transaction.serializeBinary()
  }

  private static serializeTxData = (
    txData: SignedTx['data'],
    category: TxCategory
  ): Uint8Array => {
    switch (category) {
      case TxCategory.INIT_DID: {
        const data = txData as InitDidTxData
        const initTxData = new InitDid()
        initTxData.setDid(data.did)
        initTxData.setMasterpubkey(data.masterPubKey)
        initTxData.setDerivedkeyindex(data.derivedKeyIndex)
        initTxData.setDerivedpubkey(data.derivedPubKey)
        initTxData.setEncderivedprivkey(data.encDerivedPrivKey)
        return initTxData.serializeBinary()
      }
      // case TxCategory.NOTIFICATION: {
      //   break
      // }
      // case TxCategory.EMAIL: {
      //   break
      // }
      default: {
        throw new Error('Invalid Tx Category')
      }
    }
  }
}
