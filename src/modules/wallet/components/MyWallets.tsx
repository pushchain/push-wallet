import { FC } from "react";
import { Box, Separator, Text } from "../../../blocks";
import { WalletList } from "./WalletList";
import { css } from "styled-components";

export type MyWalletsProps = {};

const MyWallets: FC<MyWalletsProps> = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing-sm"
      height="292px"
      overflow="scroll"
    >
      <WalletList />
      <Box display="flex" gap="spacing-sm" alignItems="center">
        <Separator />
        <Text
          variant="c-bold"
          color="text-tertiary"
          css={css`
            flex-shrink: 0;
          `}
        >
          Connect more accounts
        </Text>
        <Separator />
      </Box>
      {/* Here comes the wallet selection component */}
    </Box>
  );
};

export { MyWallets };
