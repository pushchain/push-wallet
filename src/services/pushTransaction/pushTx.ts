import { v4 as uuidv4, parse } from 'uuid'
import { Tx, TxCategory, InitDidTxData } from './pushTx.types'
import { Transaction } from '../../generated/tx'
import { InitDid } from '../../generated/txData/init_did'

export class PushTx {
  /**
   * Create an Unsigned Tx
   * @param category Tx category
   * @param recipients Tx recipients
   * @param data Tx payload data
   * @param source Sender's source chain
   * @param apiToken Validator API token
   * @returns Unsigned Tx
   */
  static createTx = (
    category: TxCategory,
    recipients: string[],
    data: Tx['data'],
    source: string,
    apiToken: Uint8Array
  ): Tx => {
    return {
      type: 0, // Phase 0 only has non-value transfers
      category,
      source,
      recipients,
      data,
      salt: parse(uuidv4()),
      apiToken,
      signature: new Uint8Array(0),
      fee: '0', // Fee is 0 as of now
    }
  }

  static serializeTx = (tx: Tx): Uint8Array => {
    const transaction = Transaction.create({
      ...tx,
      data: PushTx.serializeTxData(tx.data, tx.category),
    })
    return Transaction.encode(transaction).finish()
  }

  static deserializeTx = (tx: Uint8Array): Tx => {
    const transaction = Transaction.decode(tx)
    const data = this.deserializeTxData(
      transaction.data,
      transaction.category as TxCategory
    )
    return {
      ...transaction,
      data,
      category: transaction.category as TxCategory,
    }
  }

  private static serializeTxData = (
    txData: Tx['data'],
    category: TxCategory
  ): Uint8Array => {
    switch (category) {
      case TxCategory.INIT_DID: {
        const data = txData as InitDidTxData
        const initTxData = InitDid.create(data)
        return InitDid.encode(initTxData).finish()
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

  private static deserializeTxData = (
    txData: Uint8Array,
    category: TxCategory
  ): Tx['data'] => {
    switch (category) {
      case TxCategory.INIT_DID: {
        return InitDid.decode(txData)
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
