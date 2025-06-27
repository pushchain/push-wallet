import React, { createContext, useContext, useState, ReactNode } from "react";
import { SendTokenState, TokenFormat } from "../types";
import { useExternalWallet } from "./ExternalWalletContext";
import { parseUnits } from "viem";
import { PushChain } from "@pushchain/core";
import { PUSH_NETWORK } from "@pushchain/core/src/lib/constants/enums";
import { useGlobalState } from "./GlobalContext";
import { useWalletDashboard } from "./WalletDashboardContext";

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
  txError: string;
}

const SendTokenContext = createContext<SendTokenContextType | undefined>(
  undefined
);

export const SendTokenProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {

  const { state } = useGlobalState();
  const {
    selectedWallet,
  } = useWalletDashboard();

  const [sendState, setSendState] = useState<SendTokenState>("selectToken");
  const [tokenSelected, setTokenSelected] = useState<TokenFormat | null>(null);
  const [receiverAddress, setReceiverAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  const [sendingTransaction, setSendingTransaction] = useState<boolean>(false);
  const [txhash, setTxhash] = useState<string | null>(null);

  const [txError, setTxError] = useState<string>('');

  const {
    currentWallet,
    signMessageRequest,
    signTransactionRequest,
    signTypedDataRequest,
  } = useExternalWallet();

  const parsedWallet =
    selectedWallet?.address || currentWallet?.address;

  const handleSendTransaction = async () => {
    try {
      setSendingTransaction(true);
      setTxError('')
      const value = parseUnits(amount.toString(), tokenSelected.decimals);

      const universalAccount = PushChain.utils.account.fromChainAgnostic(
        parsedWallet
      );

      const CHAINS = PushChain.CONSTANTS.CHAIN;

      const isSolana = [
        CHAINS.SOLANA_DEVNET,
        CHAINS.SOLANA_MAINNET,
        CHAINS.SOLANA_TESTNET,
      ].includes(universalAccount.chain);

      const signerSkeleton = PushChain.utils.signer.construct(
        universalAccount,
        {
          signMessage: state.wallet ? state.wallet.signMessage : signMessageRequest,
          signAndSendTransaction: state.wallet ? state.wallet.signAndSendTransaction : signTransactionRequest,
          signTypedData: isSolana ? undefined : state.wallet ? state.wallet.signTypedData : signTypedDataRequest,
        }
      );

      const universalSigner = await PushChain.utils.signer.toUniversal(
        signerSkeleton
      );

      const pushChainClient = await PushChain.initialize(universalSigner, {
        network: PUSH_NETWORK.TESTNET_DONUT,
      });

      const receipt = await pushChainClient.universal.sendTransaction({
        to: receiverAddress as `0x${string}`,
        value: value,
        data: "0x",
      });
      console.log("Transaction confirmed", receipt);

      if (receipt.transactionHash) {
        setSendState("confirmation");
        setTxhash(receipt.transactionHash);
      }
    } catch (error) {
      console.log("Error in sending transaction", error, error.message);
      setTxError(error.message)
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
