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
}

const SendTokenContext = createContext<SendTokenContextType | undefined>(undefined);

export const SendTokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sendState, setSendState] = useState<SendTokenState>('selectToken');
    const [tokenSelected, setTokenSelected] = useState<TokenType | null>(null);
    const [receiverAddress, setReceiverAddress] = useState<string | null>(null);
    const [amount, setAmount] = useState<number | null>(null);

    const [sendingTransaction, setSendingTransaction] = useState<boolean>(false);

    const handleSendTransaction = () => {

        setSendingTransaction(true);
        console.log("Sending transaction");

        setTimeout(() => {
            setSendingTransaction(false);
            setSendState('confirmation')
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