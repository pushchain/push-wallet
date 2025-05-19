import React, { FC, useState, useMemo } from "react";
import { Back, Box, CaretRight, deviceSizes, Info, Text } from "blocks";
import {
  DrawerWrapper,
  ErrorContent,
  LoadingContent,
  PoweredByPush,
  useDeviceWidthCheck,
  walletCategories,
} from "common";
import { WalletState } from "../Authentication.types";
import ChainSelector from "./ChainSelector";
import { css } from "styled-components";
import { WalletCategoriesType } from "src/types/wallet.types";
import { useGlobalState } from "../../../context/GlobalContext";

type WalletSelectionProps = {
  setConnectMethod: (connectMethod: WalletState) => void;
};

const ConnectWallet: FC<WalletSelectionProps> = ({ setConnectMethod }) => {
  const { dispatch, state: { externalWalletAuthState, walletConfig } } = useGlobalState();
  const isMobile = useDeviceWidthCheck(parseInt(deviceSizes.tablet));
  const [selectedWalletCategory, setSelectedWalletCategory] = useState<WalletCategoriesType | null>(null)

  const filteredWalletCategories = useMemo(() => {
    let filtered = walletCategories;

    // Filter by device type (mobile/desktop)
    filtered = filtered.filter((wallet) => wallet.isMobile === isMobile);

    // Filter by configured chains
    if (walletConfig?.loginDefaults?.wallet?.chains?.length) {
      filtered = filtered.filter(category =>
        walletConfig.loginDefaults.wallet.chains.includes(category.wallet)
      );
    }

    return filtered;
  }, [walletConfig?.loginDefaults?.wallet?.chains, isMobile]);

  const handleBack = () => {
    if (selectedWalletCategory) setSelectedWalletCategory(null);
    else setConnectMethod("authentication");
  };

  return (
    <Box flexDirection="column" display="flex" gap="spacing-lg" width="100%">
      <Box cursor="pointer" onClick={() => handleBack()}>
        <Back color="icon-tertiary" size={24} />
      </Box>
      <Box flexDirection="column" display="flex" gap="spacing-md">
        <Box flexDirection="column" display="flex" gap="spacing-md">
          <Box flexDirection="column" display="flex" textAlign="center">
            <Text color="text-primary" variant="h4-semibold">
              Connect External Wallet
            </Text>
            <Text color="text-primary" variant="bs-regular">
              Choose what kind of wallet you would like to link with Push
            </Text>
          </Box>

          <Box
            flexDirection="column"
            display="flex"
            gap="spacing-xxs"
            height="299px"
            overflow="hidden auto"
            customScrollbar
          >
            {!selectedWalletCategory ? (
              <Box display="flex" flexDirection="column" gap="spacing-xxs">
                {filteredWalletCategories?.map((walletCategory) => (
                  <Box
                    cursor="pointer"
                    css={css`
                      :hover {
                        border: var(--border-sm, 1px) solid
                          var(--stroke-brand-medium);
                      }
                    `}
                    display="flex"
                    padding="spacing-xs"
                    borderRadius="radius-xs"
                    border="border-sm solid stroke-tertiary"
                    backgroundColor="surface-transparent"
                    alignItems="center"
                    justifyContent="space-between"
                    key={walletCategory.chain}
                    onClick={() => {
                      setSelectedWalletCategory(walletCategory)
                    }}
                  >
                    <Box alignItems="center" display="flex" gap="spacing-xxs">
                      {walletCategory.icon}
                      <Text variant="bs-semibold" color="text-primary">
                        {walletCategory.label}
                      </Text>
                    </Box>
                    <CaretRight size={24} color="icon-tertiary" />
                  </Box>
                ))}
              </Box>
            ) : (
              <ChainSelector selectedWalletCategory={selectedWalletCategory} />
            )}
          </Box>
        </Box>
      </Box>
      <PoweredByPush />
      {externalWalletAuthState === "loading" && (
        <DrawerWrapper>
          <LoadingContent
            title={`${selectedWalletCategory.label}`}
            subTitle="Click connect in your wallet"
            onClose={() => dispatch({ type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE", payload: "idle" })}
          />
        </DrawerWrapper>
      )}

      {externalWalletAuthState === "rejected" && (
        <DrawerWrapper>
          <ErrorContent
            icon={<Info size={32} color="icon-state-danger-subtle" />}
            title="Could not Connect"
            subTitle="Please try connecting again"
            onClose={() =>
              dispatch({
                type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
                payload: "idle",
              })
            }
          />
        </DrawerWrapper>
      )}
    </Box>
  );
};

export default ConnectWallet;
