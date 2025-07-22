import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { SendTokenState, TokenFormat } from "../types";
import { parseUnits } from "viem";
import { usePushChain } from "../hooks/usePushChain";
import { getAppParamValue, WALLET_TO_APP_ACTION } from "common";
import { useEventEmitterContext } from "./EventEmitterContext";
import { ExecuteParams } from "@pushchain/core/src/lib/orchestrator/orchestrator.types";

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

  const [txError, setTxError] = useState<string>('');

  const { sendMessageToMainTab, setTxhash, txhash } = useEventEmitterContext();
  const { pushChainClient, executorAddress } = usePushChain();

  const isOpenedInIframe = !!getAppParamValue();

  const handleSendTransaction = async () => {

    try {
      setSendingTransaction(true);
      setTxError('')
      const value = parseUnits((amount || '0').toString(), tokenSelected.decimals);

      const payload: ExecuteParams = {
        to: receiverAddress as `0x${string}`,
        value: value,
        data: "0x",
      }

      if (isOpenedInIframe) {
        sendMessageToMainTab({
          type: WALLET_TO_APP_ACTION.PUSH_SEND_TRANSACTION,
          data: { ...payload, value: value.toString() },
        });

        return;
      }

      const receipt = await pushChainClient.universal.sendTransaction(payload);

      if (receipt.hash) {
        setSendState("confirmation");
        setTxhash(receipt.hash);
      }
      setSendingTransaction(false);
    } catch (error) {
      console.error("Error in sending transaction", error);
      setTxError(error.message)
      setSendingTransaction(false);
    }
  };

  useEffect(() => {
    if (txhash && sendState !== 'confirmation') setSendState("confirmation");
  }, [txhash])

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
