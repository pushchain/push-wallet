import React, { FC } from "react";
import { ChainType } from "../../../types/wallet.types";
import { walletRegistry } from "../../../providers/WalletProviderRegistry";
import WalletSelector from "./WalletSelector";

interface ChainWalletSelectorProps {
  chainType: string;
}

const ChainSelector: FC<ChainWalletSelectorProps> = ({ chainType }) => {
  const wallets = walletRegistry.getProvidersByChain(chainType as ChainType);

  if (wallets.length === 0) {
    return <div>No wallets available for {chainType}</div>;
  }

  return (
    <>
      {wallets.map((wallet) => (
        <WalletSelector key={wallet.name} provider={wallet} />
      ))}
    </>
  );
};

export default ChainSelector;
