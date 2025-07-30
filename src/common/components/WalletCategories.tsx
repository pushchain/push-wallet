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
              border: var(--border-sm, 1px) solid var(--pw-int-brand-primary-color);
            }
          `}
          display="flex"
          padding="spacing-xs"
          borderRadius="radius-xs"
          border="border-sm solid pw-int-border-tertiary-color"
          backgroundColor="pw-int-bg-transparent"
          alignItems="center"
          justifyContent="space-between"
          key={walletCategory.label}
          onClick={() => setSelectedWalletCategory?.(walletCategory.wallet)}
        >
          <Box alignItems="center" display="flex" gap="spacing-xxs">
            {walletCategory.icon}
            <Text variant="bs-semibold" color="pw-int-text-primary-color">
              {walletCategory.label}
            </Text>
          </Box>
          <CaretRight size={24} color="pw-int-icon-tertiary-color" />
        </Box>
      ))}
    </Box>
  );
};

export { WalletCategories };
