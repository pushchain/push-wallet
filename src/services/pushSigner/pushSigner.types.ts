export type Signer = {
  /** @dev In CAIP-10 format */
  account: string
  signMessage: (dataToBeSigned: string) => Promise<Uint8Array>
}
