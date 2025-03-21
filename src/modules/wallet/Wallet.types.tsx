export type WalletListType = {
  name: string;
  address: string;
  fullAddress: string;
  isSelected: boolean;
  type: string;
};


export type UniversalAddress = {
  chainId: string | null;
  chain: string | null;
  address: string | null;
}