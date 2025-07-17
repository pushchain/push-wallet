import React, { createContext, useContext, useState, ReactNode } from "react";
import { SendTokenState, TokenFormat } from "../types";
import { parseUnits } from "viem";
import { usePushChain } from "../hooks/usePushChain";

interface SendTokenContextType {
  walletAddress: string;
  sendState: SendTokenState;
  setSendState: (state: SendTokenState) => void;
  tokenSelected: TokenFormat | null;
  setTokenSelected: (token: TokenFormat | null) => void;
  receiverAddress: string | null;
  setReceiverAddress: (address: string | null) => void;
  amount: string;
  setAmount: (amount: string) => void;
  sendingTransaction: boolean;
  handleSendTransaction: () => void;
  txhash: string | null;
  setTxhash: (txHash: string | null) => void;
  txError: string;
}

const SendTokenContext = createContext<SendTokenContextType | undefined>(
  undefined
);

export const SendTokenProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {

  const [sendState, setSendState] = useState<SendTokenState>("selectToken");
  const [tokenSelected, setTokenSelected] = useState<TokenFormat | null>(null);
  const [receiverAddress, setReceiverAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const [sendingTransaction, setSendingTransaction] = useState<boolean>(false);
  const [txhash, setTxhash] = useState<string | null>(null);

  const [txError, setTxError] = useState<string>('');

  const { pushChainClient, executorAddress } = usePushChain();

  const handleSendTransaction = async () => {

    try {
      setSendingTransaction(true);
      setTxError('')
      const value = parseUnits((amount || '0').toString(), tokenSelected.decimals);


      const receipt = await pushChainClient.universal.sendTransaction({
        to: receiverAddress as `0x${string}`,
        value: value,
        data: "0x",
      });

      if (receipt.hash) {
        setSendState("confirmation");
        setTxhash(receipt.hash);
      }
    } catch (error) {
      console.error("Error in sending transaction", error);
      setTxError(error.message)
    } finally {
      setSendingTransaction(false);
    }
  };

  const value = {
    walletAddress: executorAddress,
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
    setTxhash,
    txError
  };

  return (
    <SendTokenContext.Provider value={value}>
      {children}
    </SendTokenContext.Provider>
  );
};

export const useSendTokenContext = () => {
  const context = useContext(SendTokenContext);
  if (context === undefined) {
    throw new Error("useSendTokenContext must be used within a SendProvider");
  }
  return context;
};
