import { FC } from "react";
import {
  Box,
  Download,
  IconLeading,
  SendNotification,
  Spinner,
  Text,
} from "../../../../blocks";
import WalletHeader from "./WalletHeader";
import { useWalletDashboard } from "../../../../context/WalletDashboardContext";
import { useWalletOperations } from "../../../../hooks/useWalletOperations";
import { FAUCET_URL } from "common";
import { formatTokenValue } from "../../Wallet.utils";

export type WalletProfileProps = {
  walletAddress: string;
};

const buttonConfigs = [
  {
    icon: Download,
    label: "Receive",
    onClick: (setActiveState: (state: string) => void) =>
      setActiveState("receive"),
  },
  {
    icon: SendNotification,
    label: "Send",
    onClick: (setActiveState: (state: string) => void) =>
      setActiveState("send"),
  },
  {
    icon: IconLeading,
    label: "Faucet",
    onClick: () => window.open(FAUCET_URL, "_blank"),
  },
];

const WalletProfile: FC<WalletProfileProps> = ({ walletAddress }) => {
  const { setActiveState } = useWalletDashboard();


  const {
    data: balance,
    isLoading: isBalanceLoading,
  } = useWalletOperations(walletAddress);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing-md"
      width="100%"
    >
      <WalletHeader walletAddress={walletAddress} />

      <Box
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          display="flex"
          margin="spacing-none spacing-none spacing-xxxs spacing-none"
        >
          {isBalanceLoading ? (
            <Spinner size="extraLarge" variant="primary" />
          ) : (
            <Text
              color="pw-int-text-primary-color"
              variant="h2-semibold"
              textAlign="center"
            >
              {formatTokenValue((Number(balance ?? 0).toFixed(3)), 2)} PC
            </Text>
          )}
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        {buttonConfigs.map(({ icon: Icon, label, onClick }) => (
          <Box
            key={label}
            display="flex"
            minWidth="100px"
            flexDirection="column"
            padding="spacing-xs"
            justifyContent="center"
            alignItems="center"
            gap="spacing-xxs"
            alignSelf="stretch"
            borderRadius="radius-xs"
            border="border-sm solid pw-int-border-primary-color"
            cursor="pointer"
            backgroundColor="pw-int-bg-primary-color"
            onClick={() => onClick(setActiveState)}
          >
            <Icon color="pw-int-icon-brand-color" size={24} />
            <Text variant="bes-semibold">{label}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export { WalletProfile };
