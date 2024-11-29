import { FC, useEffect, useState } from "react";
import { Back, Box, Text } from "../../../blocks";
import { PoweredByPush, WalletCategories, WALLETS_LOGO } from "../../../common";
import { solanaWallets } from "../Authentication.constants";
import { css } from "styled-components";
import {
  useDynamicContext,
  useWalletOptions,
} from "@dynamic-labs/sdk-react-core";
import {
  filterEthereumWallets,
  getGroupedWallets,
} from "../Authentication.utils";
import { WalletKeyPairType, WalletState } from "../Authentication.types";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../../constants";
type WalletSelectionProps = {
  setConnectMethod: React.Dispatch<React.SetStateAction<WalletState>>;
};

const WalletSelection: FC<WalletSelectionProps> = ({ setConnectMethod }) => {
  const [selectedWalletCategory, setSelectedWalletCategory] =
    useState<string>("");
  const { primaryWallet } = useDynamicContext();
  const { walletOptions, selectWalletOption } = useWalletOptions();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      if (primaryWallet) {
        navigate(APP_ROUTES.WALLET);
      }
    })();
  }, [primaryWallet]);

  const ethereumWallets: WalletKeyPairType = filterEthereumWallets(
    getGroupedWallets(walletOptions)
  );
  const walletsToShow =
    selectedWalletCategory === "ethereum" ? ethereumWallets : solanaWallets;

  const handleBack = () => {
    if (selectedWalletCategory) setSelectedWalletCategory("");
    else setConnectMethod("authentication");
  };

  const handleWalletOption = (key: string) => {
    selectWalletOption(key);
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
              Continue with Wallet
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
    </Box>
  );
};

export { WalletSelection };
