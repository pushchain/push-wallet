export type Signer = {
  /** @dev In CAIP-10 format */
  account: string
  chainId: number
  signMessage: (dataToBeSigned: string) => Promise<string>
}
