import { Box, Text, Button, Link } from "blocks";
import { FC } from "react";

//what links should be there 
export const WalletReconstructionErrorContent: FC = ({}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="spacing-md"
    >
      <Text variant="h3-semibold" color="text-primary" textAlign="center">
        Unable to reconstruct existing wallet
      </Text>
      <Link to="/auth">
      <Button variant="secondary" block size="small">
        Back to home
      </Button>
      </Link>
      <Link
        textProps={{ color: "text-brand-medium", variant: "bes-semibold" }}
        to="/auth"
      >
        Create New Wallet
      </Link>

      <Text variant="cs-regular" color="text-tertiary">
        Tip: Creating a new wallet will make your old wallet inaccessible.
      </Text>
    </Box>
  );
};
