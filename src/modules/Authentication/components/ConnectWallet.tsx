import React, { FC, useState, useMemo } from "react";
import { Back, Box, CaretRight, deviceSizes, Info, Text } from "blocks";
import {
  DrawerWrapper,
  ErrorContent,
  getAppParamValue,
  isUIKitVersion,
  LoadingContent,
  PoweredByPush,
  useDeviceWidthCheck,
  walletCategories,
} from "common";
import { WalletState } from "../Authentication.types";
import ChainSelector from "./ChainSelector";
import { css } from "styled-components";
import { ChainType, WalletCategoriesType } from "../../../types/wallet.types";
import { useGlobalState } from "../../../context/GlobalContext";

type WalletSelectionProps = {
  setConnectMethod: (connectMethod: WalletState) => void;
};

const ConnectWallet: FC<WalletSelectionProps> = ({ setConnectMethod }) => {
  const { dispatch, state: { externalWalletAuthState, walletConfig } } = useGlobalState();
  const isMobile = useDeviceWidthCheck(parseInt(deviceSizes.laptop));
  const [selectedWalletCategory, setSelectedWalletCategory] = useState<WalletCategoriesType | null>(null);

  const isOpenedInIframe = !!getAppParamValue();

  const filteredWalletCategories = useMemo(() => {
    let filtered = walletCategories;

    // Filter by device type (mobile/desktop)
    filtered = isMobile
      ? filtered.filter((wallet) => wallet.isMobile === isMobile)
      : filtered;

    const showArbitrumAndBase = isUIKitVersion('2') || !isOpenedInIframe;

    // Remove arbitrum and base
    filtered = !showArbitrumAndBase
      ? filtered.filter((wallet) => wallet.chain !== ChainType.ARBITRUM && wallet.chain !== ChainType.BASE)
      : filtered;


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
        <Back color="pw-int-icon-tertiary-color" size={24} />
      </Box>
      <Box flexDirection="column" display="flex" gap="spacing-md">
        <Box flexDirection="column" display="flex" gap="spacing-md">
          <Box flexDirection="column" display="flex" textAlign="center">
            <Text color="pw-int-text-primary-color" variant="h4-semibold">
              Connect External Wallet
            </Text>
            <Text color="pw-int-text-primary-color" variant="bs-regular">
              Choose what kind of wallet you would like to link with Push
            </Text>
          </Box>

          <Box
            flexDirection="column"
            display="flex"
            gap="spacing-xxs"
            height="299px"
            overflow="hidden scroll"
            customScrollbar
            css={css`
              padding-right: 6px;
              margin-right: -8px;
            `}
          >
            {!selectedWalletCategory ? (
              <Box display="flex" flexDirection="column" gap="spacing-xxs">
                {filteredWalletCategories?.map((walletCategory) => (
                  <Box
                    cursor="pointer"
                    css={css`
                      :hover {
                        border: var(--border-sm, 1px) solid
                          var(--pw-int-brand-primary-color);
                      }
                    `}
                    display="flex"
                    padding="spacing-xs"
                    borderRadius="radius-xs"
                    border="border-sm solid pw-int-border-tertiary-color"
                    backgroundColor="pw-int-bg-transparent"
                    alignItems="center"
                    justifyContent="space-between"
                    key={walletCategory.chain}
                    onClick={() => {
                      setSelectedWalletCategory(walletCategory)
                    }}
                  >
                    <Box alignItems="center" display="flex" gap="spacing-xxs">
                      {walletCategory.icon}
                      <Text variant="bs-semibold" color="pw-int-text-primary-color">
                        {walletCategory.label}
                      </Text>
                    </Box>
                    <CaretRight size={24} color="pw-int-icon-tertiary-color" />
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
            icon={<Info size={32} color="pw-int-icon-danger-bold-color" />}
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
