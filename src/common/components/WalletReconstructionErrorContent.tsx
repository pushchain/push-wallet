import { Box, Text, Button } from "blocks";
import { FC } from "react";
import { css } from "styled-components";

type WalletReconstructionErrorContentProps = {
  onSuccess: () => void
  onError: () => void
}

export const WalletReconstructionErrorContent: FC<WalletReconstructionErrorContentProps> = ({
  onSuccess,
  onError
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="spacing-md"
      width='100%'
    >
      <Text variant="h3-semibold" color="text-primary" textAlign="center">
        Unable to reconstruct existing wallet
      </Text>
      <Box display='flex' flexDirection='column' gap='spacing-xs'>
        <Button css={css`width:100%`} variant='tertiary' onClick={() => onError()}>Back to home</Button>

        <Button css={css`width:100%`} variant='primary' onClick={onSuccess}>Create New Wallet</Button>

        <Text variant="cs-regular" color="text-tertiary">
          Tip: Creating a new wallet will make your old wallet inaccessible.
        </Text>
      </Box>
    </Box>
  );
};
