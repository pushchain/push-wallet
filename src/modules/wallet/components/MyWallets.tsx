import { FC } from "react";
import { Box, Separator, Text } from "../../../blocks";
import { WalletList } from "./WalletList";
import { css } from "styled-components";
import { WalletCategories } from "../../../common";

export type MyWalletsProps = {};

const MyWallets: FC<MyWalletsProps> = () => {
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing-sm"
      height="292px"
      overflow="hidden scroll"
      customScrollbar
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
      <WalletCategories/>
    </Box>
  );
};

export { MyWallets };
