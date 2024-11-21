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
import { centerMaskWalletAddress } from "../../../common";
import { PushWallet } from "../../../services/pushWallet/pushWallet";
import { useGlobalState } from "../../../context/GlobalContext";
import { getWalletlist } from "../Wallet.utils";

export type WalletListProps = {};

const WalletList: FC<WalletListProps> = () => {
  const { state } = useGlobalState();
  const [walletList, setWalletList] = useState(
    getWalletlist(state?.wallet || null)
  );

  const handleWalletClick = (index) => {
    setWalletList((prevList) =>
      prevList.map((wallet, i) => ({
        ...wallet,
        isSelected: i === index, 
      }))
    );
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
