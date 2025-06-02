
export type ActiveStates = 'walletDashboard' | 'send' | 'receive' | 'addTokens'
export type TokenType = {
    id: number;
    name: string;
    symbol: string;
    amount: number;
    amountInUsd: number;
    amountChange: string;
    contractAddress: string;
}

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

export type SendTokenState = 'selectToken' | 'selectRecipient' | 'review' | 'confirmation'