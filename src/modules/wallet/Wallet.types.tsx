export type UniversalAddress = {
  chainId: string | null;
  chain: string | null;
  address: string | null;
}

export type TransactionType = 'token_transfer' |
  'contract_creation' |
  'contract_call' |
  'token_creation' |
  'coin_transfer' |
  'blob_transaction' |
  'universal_tx';