import { Box, Text, Spinner } from "blocks";
import { FC } from "react";

export type PushWalletLoadingContentProps = {
  title?: string;
  subtitle?: string;
};

export const PushWalletLoadingContent: FC<PushWalletLoadingContentProps> = ({
  title = "Loading Push Wallet",
  subtitle = "Hang tight, creating a seamless web3 experience for you...",
}) => {
  return (
    <Box
      gap="spacing-sm"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Spinner size="large" variant="primary" />
      <Box
        display="flex"
        flexDirection="column"
        textAlign="center"
        gap="spacing-xxxs"
      >
        <Text variant="h3-semibold" color="text-primary">
          {title}
        </Text>
        <Text variant="bs-regular" color="text-secondary">
          {subtitle}
        </Text>
      </Box>
    </Box>
  );
};
