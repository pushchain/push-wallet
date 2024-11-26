import { FC, useEffect, useState } from "react";
import { Back, Box, Text } from "../../../blocks";
import { PoweredByPush, WalletCategories } from "../../../common";
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
type WalletSelectionProps = {
  setConnectMethod: React.Dispatch<React.SetStateAction<WalletState>>;
};

//optimise
const WalletSelection: FC<WalletSelectionProps> = ({ setConnectMethod }) => {
  const [selectedWalletCategory, setSelectedWalletCategory] =
    useState<string>("");
  const { primaryWallet } = useDynamicContext();
  const { walletOptions, selectWalletOption } = useWalletOptions();
  const navigate = useNavigate();


  useEffect(() => {
    (async () => {
      if (primaryWallet) {
        // let pushWallet;
        // // setProfileLoading(true);
        // const signer = await PushSigner.initialize(primaryWallet, "DYNAMIC");
        // pushWallet = await PushWallet.loginWithWallet(
        //   signer,
        //   config.APP_ENV as ENV
        // );
        // dispatch({ type: "INITIALIZE_WALLET", payload: pushWallet });
        navigate("/wallet");
        // setProfileLoading(false);
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
    navigate("/wallet");
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
                    justifyContent="space-between"
                    key={key}
                    onClick={() => handleWalletOption(key)}
                  >
                    <Box alignItems="center" display="flex">
                      {/* {walletCategory.icon} */}
                      <Text variant="bs-semibold" color="text-primary">
                        {name}
                      </Text>
                    </Box>
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
