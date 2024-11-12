import { FC } from "react";
import { Back, Box, Text, Button, Ethereum, CaretRight } from "../../../blocks";
import { PoweredByPush } from "../../../common";

type WalletSelectionProps = {};

//loop through the wallet options
const WalletSelection: FC<WalletSelectionProps> = () => {
  return (
    <Box flexDirection="column" display="flex" gap="spacing-lg" width="100%">
      <Box cursor="pointer">
        <Back color="icon-tertiary" size={24} />
      </Box>
      <Box flexDirection="column" display="flex" justifyContent="space-between">
        <Box flexDirection="column" display="flex" gap="spacing-md">
          <Box flexDirection="column" display="flex" textAlign="center">
            <Text color="text-primary" variant="h4-semibold">
              Link Account
            </Text>
            <Text color="text-primary" variant="bs-regular">
              Choose what kind of wallet you would like to link with Push
            </Text>
          </Box>
          <Box flexDirection="column" display="flex" gap="spacing-xxs">
            <Box
              display="flex"
              padding="spacing-xs"
              borderRadius="radius-xs"
              border="border-sm solid stroke-tertiary"
              backgroundColor="surface-transparent"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box alignItems="center" display="flex" gap="spacing-xxs">
                <Ethereum />
                <Text variant="bs-semibold" color="text-primary">
                  {" "}
                  Link Ethereum Wallet
                </Text>
              </Box>
              <CaretRight size={24} color="icon-tertiary" />
            </Box>
            <Box
              display="flex"
              padding="spacing-xs"
              borderRadius="radius-xs"
              border="border-sm solid stroke-tertiary"
              backgroundColor="surface-transparent"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box alignItems="center" display="flex" gap="spacing-xxs">
                <Ethereum />
                <Text variant="bs-semibold" color="text-primary">
                  {" "}
                  Link solana Wallet
                </Text>
              </Box>
              <CaretRight size={24} color="icon-tertiary" />
            </Box>
          </Box>
        </Box>
        <Button variant="secondary">Skip for later</Button>
      </Box>

      <PoweredByPush />
    </Box>
  );
};

export { WalletSelection };
