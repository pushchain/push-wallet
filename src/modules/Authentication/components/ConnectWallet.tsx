import React, { FC, useState } from "react";
import { walletRegistry } from "../../../providers/WalletProviderRegistry";
import { Back, Box, CaretRight, Info, Text } from "blocks";
import { useAppState } from "../../../context/AppContext";
import {
  DrawerWrapper,
  ErrorContent,
  LoadingContent,
  PoweredByPush,
  walletCategories,
} from "common";
import { WalletState } from "../Authentication.types";
import ChainSelector from "./ChainSelector";
import { css } from "styled-components";

type WalletSelectionProps = {
  setConnectMethod: (connectMethod: WalletState) => void;
};

const ConnectWallet: FC<WalletSelectionProps> = ({ setConnectMethod }) => {
  const {
    dispatch,
    state: { externalWalletAuthState },
  } = useAppState();

  const [selectedChain, setSelectedChain] = useState<string | null>(null);

  const supportedChains = walletRegistry.getAllSupportedChains();

  const handleBack = () => {
    if (selectedChain) setSelectedChain(null);
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
            {!selectedChain ? (
              <Box display="flex" flexDirection="column" gap="spacing-xxs">
                {walletCategories?.map((walletCategory) => (
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
                    key={walletCategory.value}
                    onClick={() => setSelectedChain(walletCategory.value)}
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
              <ChainSelector chainType={selectedChain} />
            )}
          </Box>
        </Box>
      </Box>
      <PoweredByPush />
      {/* {externalWalletAuthState === "loading" && (
          <DrawerWrapper>
            <LoadingContent
              title={`Connect ${selectedWalletName}`}
              subTitle="Click connect in your wallet"
              onClose={() => dispatch({ type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE", payload:"idle" })}
            />
          </DrawerWrapper>
        )} */}
      {externalWalletAuthState === "loading" && (
        <DrawerWrapper>
          <LoadingContent
            title="Sign to verify"
            subTitle="Allow the site to connect and continue"
            onClose={() =>
              dispatch({
                type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
                payload: "rejected",
              })
            }
          />
        </DrawerWrapper>
      )}
      {externalWalletAuthState === "rejected" && (
        <DrawerWrapper>
          <ErrorContent
            icon={<Info size={32} color="icon-state-danger-subtle" />}
            title="Could not verify"
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
