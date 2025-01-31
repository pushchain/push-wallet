import { FC, useEffect, useMemo, useState } from "react";
import { Back, Box, Info, Text } from "../../../blocks";
import {
  DrawerWrapper,
  ErrorContent,
  getAppParamValue,
  LoadingContent,
  PoweredByPush,
  WalletCategories,
  WALLETS_LOGO,
} from "../../../common";
import { solanaWallets } from "../Authentication.constants";
import { css } from "styled-components";
import {
  useDynamicContext,
  useWalletOptions,
} from "@dynamic-labs/sdk-react-core";
import {
  filterEthereumWallets,
  getAuthWindowConfig,
  getGroupedWallets,
  getInstalledWallets,
} from "../Authentication.utils";
import { WalletKeyPairType, WalletState } from "../Authentication.types";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../../constants";
import { useAppState } from "../../../context/AppContext";
import { usePersistedQuery } from "../../../common/hooks/usePersistedQuery";

type WalletSelectionProps = {
  setConnectMethod: React.Dispatch<React.SetStateAction<WalletState>>;
};

const WalletSelection: FC<WalletSelectionProps> = ({ setConnectMethod }) => {
  const [selectedWalletCategory, setSelectedWalletCategory] =
    useState<string>("");
  const { primaryWallet } = useDynamicContext();
  const { walletOptions, selectWalletOption } = useWalletOptions();
  const navigate = useNavigate();

  const {
    dispatch,
    state: { externalWalletAuthState },
  } = useAppState();
  const persistQuery = usePersistedQuery();

  useEffect(() => {
    (async () => {
      if (primaryWallet) {
        const url = persistQuery(APP_ROUTES.WALLET);
        navigate(url);
      }
    })();
  }, [primaryWallet]);

  const wallets = useMemo(() => {
    const installedEthereumWallets: WalletKeyPairType = filterEthereumWallets(
      getGroupedWallets(walletOptions)
    );

    const installedSolanaWallets = getInstalledWallets(
      solanaWallets,
      walletOptions
    );

    return {
      solanaWallets: installedSolanaWallets,
      ethereumWallets: installedEthereumWallets,
    };
  }, [walletOptions]);

  const walletsToShow =
    selectedWalletCategory === "ethereum"
      ? wallets.ethereumWallets
      : wallets.solanaWallets;

  const handleBack = () => {
    if (selectedWalletCategory) setSelectedWalletCategory("");
    else setConnectMethod("authentication");
  };

  const isOpenedInIframe = !!getAppParamValue();

  const handleWalletOption = (key: string) => {
    selectWalletOption(key);

    // Below is the logic for iframe case
    // if (key === "phantom" && isOpenedInIframe) {
    //   window.open(
    //     `${window.location.origin}${APP_ROUTES.PHANTOM}`,
    //     "Phantom-login",
    //     getAuthWindowConfig()
    //   );
    // } else {
    //   selectWalletOption(key);
    // }
  };

  const FallBackWalletIcon = ({ walletKey }: { walletKey: string }) => {
    return (
      <Text color="text-tertiary" variant="bes-bold" textAlign="center">
        {walletKey.slice(0, 2).toUpperCase()}
      </Text>
    );
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
            {!primaryWallet &&
              (!selectedWalletCategory ? (
                <WalletCategories
                  setSelectedWalletCategory={setSelectedWalletCategory}
                />
              ) : (
                Object.entries(walletsToShow).map(([key, name]) => (
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
                    key={key}
                    gap="spacing-xxs"
                    onClick={() => handleWalletOption(key)}
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
                      {WALLETS_LOGO[key] || (
                        <FallBackWalletIcon walletKey={key} />
                      )}
                    </Box>
                    <Text variant="bs-semibold" color="text-primary">
                      {name}
                    </Text>
                  </Box>
                ))
              ))}
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

export { WalletSelection };
