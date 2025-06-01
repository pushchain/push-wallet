import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TokenType } from '../../../../types/wallet.types';

interface SendContextType {
    sendState: 'selectToken' | 'selectRecipient' | 'review' | 'confirmation';
    setSendState: (state: 'selectToken' | 'selectRecipient' | 'review' | 'confirmation') => void;
    tokenSelected: TokenType | null;
    setTokenSelected: (token: TokenType | null) => void;
    receiverAddress: string | null;
    setReceiverAddress: (address: string | null) => void;
    amount: number | null;
    setAmount: (amount: number | null) => void;
    sendingTransaction: boolean;
    handleSendTransaction: () => void;
}

const SendContext = createContext<SendContextType | undefined>(undefined);

export const SendProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sendState, setSendState] = useState<'selectToken' | 'selectRecipient' | 'review' | 'confirmation'>('selectToken');
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

    return <SendContext.Provider value={value}>{children}</SendContext.Provider>;
};

export const useSend = () => {
    const context = useContext(SendContext);
    if (context === undefined) {
        throw new Error('useSend must be used within a SendProvider');
    }
    return context;
}; 