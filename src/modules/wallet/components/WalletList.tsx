import { FC } from "react";
import {
  Box,
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
import { centerMaskWalletAddress } from "../../../common";

export type WalletListProps = {};

const WalletList: FC<WalletListProps> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing-xs">
      {walletList.map((wallet, index) => (
        <Box
          key={`${index}`}
          display="flex"
          padding="spacing-xs"
          gap="spacing-xxs"
          borderRadius="radius-xs"
          alignItems="center"
          justifyContent="space-between"
          border={`border-sm solid stroke-${
            wallet.isSelected ? "brand-medium" : "secondary"
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
                  <MenuItem label="Copy Address" icon={<Copy />} />
                  <MenuItem label="Unlink from account" icon={<OptOut />} />
                </Menu>
              }
            >
              <KebabMenuVertical size={16} color="icon-secondary" />
            </Dropdown>
          )}
        </Box>
      ))}
    </Box>
  );
};

export { WalletList };

const walletList = [
  {
    name: "Push Account",
    address: "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
    isSelected: false,
    type: "push",
  },
  {
    name: "MetaMask1",
    address: "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
    isSelected: true,
    type: "metamask",
  },
  {
    name: "Metamask2",
    address: "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
    isSelected: false,
    type: "metamask",
  },
];
