import { FC } from "react";
import { Box, CaretRight, Text } from "../../blocks";
import React from "react";
import { css } from "styled-components";
import { walletCategories } from "../Common.constants";

type WalletCategoriesProps = {
  setSelectedWalletCategory?:React.Dispatch<React.SetStateAction<string>>;
};

const WalletCategories: FC<WalletCategoriesProps> = ({setSelectedWalletCategory}) => {

  return (
    <Box display='flex' flexDirection='column'  gap="spacing-xxs">
      {walletCategories?.map((walletCategory) => (
        <Box
          cursor="pointer"
          css={css`
            :hover {
              border: var(--border-sm, 1px) solid var(--stroke-brand-medium);
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
          onClick={() => setSelectedWalletCategory?.(walletCategory.value)}
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
  );
};

export { WalletCategories };
