import { FC, useState } from "react";
import { Back, Box, Text, Button, CaretRight, Settings } from "../../../blocks";
import { PoweredByPush } from "../../../common";
import { solanaWallets, walletCategories } from "../Authentication.constants";
import { css } from "styled-components";
import {
  useDynamicContext,
  useUserWallets,
  useWalletOptions,
} from "@dynamic-labs/sdk-react-core";
import {
  filterEthereumWallets,
  getGroupedWallets,
} from "../Authentication.utils";
import { WalletKeyPairType } from "../Authentication.types";
import { shortenText } from "../../../common/Common.utils";
type WalletSelectionProps = {};

//optimise
const WalletSelection: FC<WalletSelectionProps> = () => {
  const [selectedWalletCategory, setSelectedWalletCategory] =
    useState<string>("");
  const userWallets = useUserWallets();
  const { primaryWallet } = useDynamicContext();

  const { walletOptions, selectWalletOption } = useWalletOptions();

  const ethereumWallets: WalletKeyPairType = filterEthereumWallets(
    getGroupedWallets(walletOptions)
  );
  const walletsToShow =
    selectedWalletCategory === "ethereum" ? ethereumWallets : solanaWallets;

  const handleBack = () => {
    if (selectedWalletCategory) setSelectedWalletCategory("");
  };

  const isConnected = async () => {
    return await userWallets[0]?.isConnected();
  };

  console.debug(userWallets, primaryWallet, isConnected());
  return (
    <Box flexDirection="column" display="flex" gap="spacing-lg" width="100%">
      <Box cursor="pointer" onClick={() => handleBack()}>
        <Back color="icon-tertiary" size={24} />
      </Box>
      <Box flexDirection="column" display="flex" gap="spacing-md">
        <Box flexDirection="column" display="flex" gap="spacing-md">
          <Box flexDirection="column" display="flex" textAlign="center">
            <Text color="text-primary" variant="h4-semibold">
              Link Account
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
            {!primaryWallet ? (
              !selectedWalletCategory ? (
                walletCategories?.map((walletCategory) => (
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
                    onClick={() =>
                      setSelectedWalletCategory(walletCategory.value)
                    }
                  >
                    <Box alignItems="center" display="flex" gap="spacing-xxs">
                      {walletCategory.icon}
                      <Text variant="bs-semibold" color="text-primary">
                        {walletCategory.label}
                      </Text>
                    </Box>
                    <CaretRight size={24} color="icon-tertiary" />
                  </Box>
                ))
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
                    justifyContent="space-between"
                    key={key}
                    onClick={() => selectWalletOption(key)}
                  >
                    <Box alignItems="center" display="flex">
                      {/* {walletCategory.icon} */}
                      <Text variant="bs-semibold" color="text-primary">
                        {name}
                      </Text>
                    </Box>
                  </Box>
                ))
              )
            ) : (
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
              >
                <Box alignItems="center" display="flex">
                  {/* {walletCategory.icon} */}
                  <Text variant="bs-semibold" color="text-primary">
                    {shortenText(primaryWallet.address,6,6)}
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

       {!primaryWallet && <Button variant="secondary">Skip for later</Button>}
       {primaryWallet && <Button >Create Account</Button>}
      </Box>
      <PoweredByPush />
    </Box>
  );
};

export { WalletSelection };
