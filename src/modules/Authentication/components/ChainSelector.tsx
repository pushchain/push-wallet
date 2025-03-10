import React, { FC } from "react";
import { WalletCategoriesType } from "../../../types/wallet.types";
import { walletRegistry } from "../../../providers/WalletProviderRegistry";
import WalletSelector from "./WalletSelector";
import { Box, Text } from "blocks";

interface ChainWalletSelectorProps {
  selectedWalletCategory: WalletCategoriesType;
}

const ChainSelector: FC<ChainWalletSelectorProps> = ({ selectedWalletCategory }) => {
  const wallets = walletRegistry.getProvidersByChain(selectedWalletCategory.chain);

  if (wallets.length === 0) {
    return (
      <Box>
        <Text>
          No wallets available for {selectedWalletCategory.chain}
        </Text>
      </Box>
    );
  }

  return (
    <>
      {wallets.map((wallet) => (
        <WalletSelector key={wallet.name} provider={wallet} walletCategory={selectedWalletCategory} />
      ))}
    </>
  );
};

export default ChainSelector;
