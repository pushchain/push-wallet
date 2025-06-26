import { FC } from "react";
import {
  Box,
  Download,
  Faucet,
  SendNotification,
  Spinner,
  Text,
} from "../../../blocks";
import WalletHeader from "./WalletHeader";
import { css } from "styled-components";
import { WalletListType } from "../../../types";
import { useWalletDashboard } from "../../../context/WalletDashboardContext";
import { useGlobalState } from "../../../context/GlobalContext";
import { convertCaipToObject } from "../Wallet.utils";
import { useWalletOperations } from "../../../hooks/useWalletOperations";
import { FAUCET_URL } from "common";

export type WalletProfileProps = {
  selectedWallet: WalletListType;
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
    icon: Faucet,
    label: "Faucet",
    onClick: () => window.open(FAUCET_URL, "_blank"),
  },
];

const WalletProfile: FC<WalletProfileProps> = ({ selectedWallet }) => {
  const { setActiveState } = useWalletDashboard();
  const { state } = useGlobalState();

  const parsedWallet =
    selectedWallet?.address || state?.externalWallet?.address;

  const { result } = convertCaipToObject(parsedWallet);

  const {
    data: balance,
    isLoading: isBalanceLoading,
  } = useWalletOperations(result.address);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing-md"
      width="-webkit-fill-available"
    >
      <WalletHeader selectedWallet={selectedWallet} />

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
              {Number(Number(balance).toFixed(3)).toLocaleString()} PC
            </Text>
          )}
        </Box>

        <Box display="flex" gap="spacing-xxxs">
          <Text color="pw-int-text-secondary-color">+$276.29</Text>
          <Box
            padding="spacing-none spacing-xxxs"
            borderRadius="radius-xs"
            backgroundColor="pw-int-success-primary-subtle-color"
          >
            <Text color="pw-int-text-primary-color">+0.97%</Text>
          </Box>
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
            css={css`
              background: linear-gradient(
                  0deg,
                  rgba(255, 255, 255, 0.05) 0%,
                  rgba(255, 255, 255, 0.05) 100%
                ),
                var(--surface-tertiary, #313338);
            `}
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
