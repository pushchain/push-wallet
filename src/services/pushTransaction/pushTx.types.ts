export enum TxCategory {
  INIT_DID = 'INIT_DID',
  INIT_SESSION_KEY = 'INIT_SESSION_KEY',
  NOTIFICATION = 'NOTIFICATION',
  EMAIL = 'EMAIL',
}

export type Tx = {
  type: number
  category: TxCategory
  source: string
  recipients: string[]
  data: InitDidTxData | NotificationTxData | EmailTxData
  salt: Uint8Array
  apiToken: Uint8Array
  signature: Uint8Array
  fee: string
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
