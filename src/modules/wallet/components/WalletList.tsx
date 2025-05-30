import { FC } from "react";
import {
  Box,
  Copy,
  Dropdown,
  KebabMenuVertical,
  Menu,
  MenuItem,
  PushLogo,
  Text,
} from "../../../blocks";
import { centerMaskWalletAddress, handleCopy } from "../../../common";
import { WalletListType } from "../Wallet.types";
import BlockiesSvg from "blockies-react-svg";

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
          border={`border-sm solid ${wallet?.address === selectedWallet?.address
            ? "pw-int-border-brand-medium"
            : "pw-int-border-secondary-color"
          }`}
        >
          <Box display="flex" gap="spacing-xxs">
            {/* Add support for different icons */}
            {wallet.type === "push" ? (
              <PushLogo height={24} width={24} />
            ) : (
              <Box
                width="24px"
                height="24px"
                borderRadius="radius-xl"
                overflow="hidden"
                alignSelf="center"
              >
                <BlockiesSvg address={wallet.address} />
              </Box>
            )}
            <Box display="flex" flexDirection="column">
              <Text variant="bs-semibold">{wallet.name}</Text>
              <Text variant="cs-semibold" color="pw-int-text-tertiary-color">
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
                <KebabMenuVertical size={16} color="pw-int-icon-secondary-color" />
              </Box>
            </Dropdown>
          )}
        </Box>
      ))}
    </Box>
  );
};

export { WalletList };
