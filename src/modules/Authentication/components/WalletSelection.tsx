import { FC } from "react";
import {
  Back,
  Box,
  Text,
  Button,
  Ethereum,
  CaretRight,
  Solana,
} from "../../../blocks";
import { PoweredByPush } from "../../../common";
import { walletCategories } from "../Authentication.constants";
import { css } from "styled-components";
import { useWalletOptions,useUserWallets } from "@dynamic-labs/sdk-react-core";

type WalletSelectionProps = {};

//loop through the wallet options
const WalletSelection: FC<WalletSelectionProps> = () => {
    const { walletOptions } = useWalletOptions();
    const userWallets = useUserWallets()
    console.debug(walletOptions,'wallets');
    console.debug(userWallets,'wallets');
  return (
    <Box flexDirection="column" display="flex" gap="spacing-lg" width="100%">
      <Box cursor="pointer">
        <Back color="icon-tertiary" size={24} />
      </Box>
      <Box flexDirection="column" display="flex" gap="spacing-md">
        <Box
          flexDirection="column"
          display="flex"
          gap="spacing-md"
          height="299px"
        >
          <Box flexDirection="column" display="flex" textAlign="center">
            <Text color="text-primary" variant="h4-semibold">
              Link Account
            </Text>
            <Text color="text-primary" variant="bs-regular">
              Choose what kind of wallet you would like to link with Push
            </Text>
          </Box>
          <Box flexDirection="column" display="flex" gap="spacing-xxs">
            {walletCategories.map((walletCategory) => (
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
        </Box>
        <Button variant="secondary">Skip for later</Button>
      </Box>

      <PoweredByPush />
    </Box>
  );
};

export { WalletSelection };
