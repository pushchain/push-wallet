import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SendTokenState, TokenType } from '../types';

interface SendTokenContextType {
    sendState: SendTokenState;
    setSendState: (state: SendTokenState) => void;
    tokenSelected: TokenType | null;
    setTokenSelected: (token: TokenType | null) => void;
    receiverAddress: string | null;
    setReceiverAddress: (address: string | null) => void;
    amount: number | null;
    setAmount: (amount: number | null) => void;
    sendingTransaction: boolean;
    handleSendTransaction: () => void;
    txhash: string | null;
    setTxhash: (txHash: string | null) => void;
}

const SendTokenContext = createContext<SendTokenContextType | undefined>(undefined);

export const SendTokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sendState, setSendState] = useState<SendTokenState>('selectToken');
    const [tokenSelected, setTokenSelected] = useState<TokenType | null>(null);
    const [receiverAddress, setReceiverAddress] = useState<string | null>(null);
    const [amount, setAmount] = useState<number | null>(null);

    const [sendingTransaction, setSendingTransaction] = useState<boolean>(false);
    const [txhash, setTxhash] = useState<string | null>(null);

    const handleSendTransaction = () => {

        setSendingTransaction(true);
        console.log("Sending transaction");

        setTimeout(() => {
            setSendingTransaction(false);
            setSendState('confirmation')
            setTxhash('0x885e40c0a7984167dc6a61bbc31feeae29a91ee3cf0f60c8c1a6da40a0284fd2')
        }, 3000);
    }

    const value = {
        sendState,
        setSendState,
        tokenSelected,
        setTokenSelected,
        receiverAddress,
        setReceiverAddress,
        amount,
        setAmount,
        sendingTransaction,
        handleSendTransaction,
        txhash,
        setTxhash
    };

    return <SendTokenContext.Provider value={value}>{children}</SendTokenContext.Provider>;
};

export const useSendTokenContext = () => {
    const context = useContext(SendTokenContext);
    if (context === undefined) {
        throw new Error('useSendTokenContext must be used within a SendProvider');
    }
    return context;
}; 