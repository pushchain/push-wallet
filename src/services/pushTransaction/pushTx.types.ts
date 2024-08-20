export enum TxCategory {
  INIT_DID = 'INIT_DID',
  INIT_SESSION_KEY = 'INIT_SESSION_KEY',
  NOTIFICATION = 'NOTIFICATION',
  EMAIL = 'EMAIL',
}

export type UnsignedTx = {
  type: 0 | 1
  category: TxCategory
  source: string
  recipients: string[]
  data: InitDidTxData | NotificationTxData | EmailTxData
  salt: string
  apiToken: string
  fee: string
}

export type SignedTx = UnsignedTx & {
  signature: string
}

export type InitDidTxData = {
  did: string
  masterPubKey: string
  derivedKeyIndex: number
  derivedPubKey: string
  encDerivedPrivKey: string
}

export type NotificationTxData = {
  title: string
  body: string
  // TODO: other params
}

export type EmailTxData = {
  subject: string
  body: string
  // TODO: other params
}
