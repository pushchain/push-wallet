import React, { createContext, useContext, useState, ReactNode } from "react";
import { SendTokenState, TokenFormat } from "../types";
import { useWallet } from "./WalletContext";
import { parseUnits } from "viem";
import { PushChain } from "@pushchain/core";
import { PUSH_NETWORK } from "@pushchain/core/src/lib/constants/enums";

interface SendTokenContextType {
  sendState: SendTokenState;
  setSendState: (state: SendTokenState) => void;
  tokenSelected: TokenFormat | null;
  setTokenSelected: (token: TokenFormat | null) => void;
  receiverAddress: string | null;
  setReceiverAddress: (address: string | null) => void;
  amount: number | null;
  setAmount: (amount: number | null) => void;
  sendingTransaction: boolean;
  handleSendTransaction: () => void;
  txhash: string | null;
  setTxhash: (txHash: string | null) => void;
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
  const [amount, setAmount] = useState<number>(0);

  const [sendingTransaction, setSendingTransaction] = useState<boolean>(false);
  const [txhash, setTxhash] = useState<string | null>(null);

  const {
    currentWallet,
    signMessageRequest,
    signTransactionRequest,
    signTypedDataRequest,
  } = useWallet();

  const handleSendTransaction = async () => {
    try {
      setSendingTransaction(true);
      const value = parseUnits(amount.toString(), tokenSelected.decimals);

      const universalAccount = PushChain.utils.account.fromChainAgnostic(
        currentWallet.address
      );

      console.log("universal Account", universalAccount);

      const CHAINS = PushChain.CONSTANTS.CHAIN;

      const isSolana = [
        CHAINS.SOLANA_DEVNET,
        CHAINS.SOLANA_MAINNET,
        CHAINS.SOLANA_TESTNET,
      ].includes(universalAccount.chain);

      const signerSkeleton = PushChain.utils.signer.construct(
        universalAccount,
        {
          signMessage: signMessageRequest,
          signAndSendTransaction: signTransactionRequest,
        }
      );

      console.log("signerSkeleton", signerSkeleton);

      const universalSigner = await PushChain.utils.signer.toUniversal(
        signerSkeleton
      );

      console.log("universalSigner", universalSigner);

      const pushChainClient = await PushChain.initialize(universalSigner, {
        network: PUSH_NETWORK.TESTNET_DONUT,
      });

      console.log("receiverAddress", receiverAddress, value);

      const receipt = await pushChainClient.universal.sendTransaction({
        to: receiverAddress as `0x${string}`,
        value: value,
        data: "0x",
      });
      // const receipt = await sendTransaction(receiverAddress, value);
      console.log("Transaction confirmed", receipt);

      if (receipt.transactionHash) {
        setSendState("confirmation");
        setTxhash(receipt.transactionHash);
      }
    } catch (error) {
      console.log("Error in sending transaction", error);
    } finally {
      setSendingTransaction(false);
    }
  };

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
    setTxhash,
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
