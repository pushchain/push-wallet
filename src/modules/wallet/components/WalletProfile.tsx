import { FC } from "react";
import { Box, Download, Faucet, SendNotification, Text } from "../../../blocks";
import WalletHeader from "./WalletHeader";
import { css } from "styled-components";
import { WalletListType } from "../../../types";
import { useWalletDashboard } from "../../../context/WalletDashboardContext";

export type WalletProfileProps = {
  selectedWallet: WalletListType;
};

const FAUCET_URL = 'https://faucet.push.org';

const buttonConfigs = [
  {
    icon: Download,
    label: 'Receive',
    onClick: (setActiveState: (state: string) => void) => setActiveState('receive')
  },
  {
    icon: SendNotification,
    label: 'Send',
    onClick: (setActiveState: (state: string) => void) => setActiveState('send')
  },
  {
    icon: Faucet,
    label: 'Faucet',
    onClick: () => window.open(FAUCET_URL, '_blank')
  }
];

const WalletProfile: FC<WalletProfileProps> = ({ selectedWallet }) => {
  const { setActiveState } = useWalletDashboard();

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
        <Text color="text-primary" variant="h2-semibold" textAlign="center">
          124.53 PC
        </Text>
        <Box display="flex" gap="spacing-xxxs">
          <Text color="text-state-success-bold">+$276.29</Text>
          <Box
            padding="spacing-none spacing-xxxs"
            borderRadius="radius-xs"
            backgroundColor="surface-state-success-subtle"
          >
            <Text color="text-state-success-bold">+0.97%</Text>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent='space-between'>
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
            border="border-sm solid stroke-primary"
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
            <Icon color='icon-brand-medium' size={24} />
            <Text variant="bes-semibold">{label}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export { WalletProfile };
