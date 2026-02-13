import { Box, Text } from "blocks";
import React, { FC } from "react";
import {
  IWalletProvider,
  WalletCategoriesType,
} from "../../../types/wallet.types";
import { css } from "styled-components";
import { WALLETS_LOGO, DrawerWrapper, NotFoundContent } from "common";
import { useConnectExternalWallet } from "../../../hooks/useConnectExternalWallet";

interface WalletButtonProps {
  provider: IWalletProvider;
  walletCategory: WalletCategoriesType;
}

const WalletSelector: FC<WalletButtonProps> = ({
  provider,
  walletCategory,
}) => {
  const [isInstalled, setIsInstalled] = React.useState<boolean | null>(null);

  const { connectWithProvider } = useConnectExternalWallet();

  const handleClick = async () => {
    const chainToConnect = provider.supportedChains.find(
      (curr) => curr === walletCategory.chain
    );
    const res = await connectWithProvider(provider, chainToConnect);
    if (!res.ok && res.reason === "not_installed") setIsInstalled(false);
    else setIsInstalled(true);
  };

  return (
    <>
      <Box
        cursor="pointer"
        css={css`
          :hover {
            border: var(--border-sm, 1px) solid var(--pw-int-brand-primary-color);
          }
        `}
        display="flex"
        padding="spacing-xs"
        borderRadius="radius-xs"
        border="border-sm solid pw-int-border-tertiary-color"
        backgroundColor="pw-int-bg-transparent"
        alignItems="center"
        gap="spacing-xxs"
        onClick={() => handleClick()}
      >
        <Box
          width="24px"
          height="24px"
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
          css={css`
            flex-shrink: 0;
          `}
        >
          {WALLETS_LOGO[provider.name.toLowerCase()] || (
            <FallBackWalletIcon walletKey={provider.name} />
          )}
        </Box>
        <Text variant="bs-semibold" color="pw-int-text-primary-color">
          {provider.name}
        </Text>
      </Box>
      {isInstalled === false && (
        <DrawerWrapper>
          <NotFoundContent
            providerName={provider.name.toLowerCase() as 'metamask' | 'zerion' | 'rabby' | 'phantom'}
            onClose={() => setIsInstalled(null)}
          />
        </DrawerWrapper>
      )}
    </>
  );
};

export default WalletSelector;

const FallBackWalletIcon = ({ walletKey }: { walletKey: string }) => {
  return (
    <Text
      color="pw-int-text-tertiary-color"
      variant="bes-bold"
      textAlign="center"
    >
      {walletKey.slice(0, 2).toUpperCase()}
    </Text>
  );
};
