import { FC, useState } from "react";
import {
  Box,
  Button,
  Copy,
  Dropdown,
  KebabMenuVertical,
  Menu,
  MenuItem,
  Metamask,
  OptOut,
  PushLogo,
  Text,
} from "../../../blocks";
import { centerMaskWalletAddress, handleCopy } from "../../../common";
import { useGlobalState } from "../../../context/GlobalContext";
import { WalletListType } from "../Wallet.types";

export type WalletListProps = {
  walletList: WalletListType[];
  selectedWallet: WalletListType;
  setSelectedWallet: React.Dispatch<React.SetStateAction<WalletListType>>;
};

const WalletList: FC<WalletListProps> = ({
  walletList,
  selectedWallet,
  setSelectedWallet,
}) => {
  const { state } = useGlobalState();

  const handleWalletClick = (index) => {
    setSelectedWallet(walletList[index]);
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing-xs">
      {walletList?.map((wallet, index) => (
        <Box
          cursor="pointer"
          key={`${index}`}
          onClick={() => handleWalletClick(index)}
          display="flex"
          padding="spacing-xs"
          gap="spacing-xxs"
          borderRadius="radius-xs"
          alignItems="center"
          justifyContent="space-between"
          border={`border-sm solid stroke-${
            wallet?.address === selectedWallet?.address
              ? "brand-medium"
              : "secondary"
          }`}
        >
          <Box display="flex" gap="spacing-xxs">
            {/* Add support for different icons */}
            {wallet.type === "push" ? (
              <PushLogo height={24} width={24} />
            ) : (
              <Metamask height={24} width={24} />
            )}
            <Box display="flex" flexDirection="column">
              <Text variant="bs-semibold">{wallet.name}</Text>
              <Text variant="cs-semibold" color="text-tertiary">
                {centerMaskWalletAddress(wallet.address)}
              </Text>
            </Box>
          </Box>
          {wallet.type !== "push" && (
            <Dropdown
              overlay={
                <Menu>
                  <MenuItem
                    label="Copy Address"
                    icon={<Copy />}
                    onClick={() => handleCopy(wallet.address)}
                  />
                  {/* <MenuItem label="Unlink from account" icon={<OptOut />} /> */}
                </Menu>
              }
            >
              <Box cursor="pointer">
                <KebabMenuVertical size={16} color="icon-secondary" />
              </Box>
            </Dropdown>
          )}
        </Box>
      ))}
    </Box>
  );
};

export { WalletList };
