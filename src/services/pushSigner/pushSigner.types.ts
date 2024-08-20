export type Signer = {
  /** @dev In CAIP-10 format */
  account: string
  source: string
  signMessage: (dataToBeSigned: string) => Promise<string>
}
