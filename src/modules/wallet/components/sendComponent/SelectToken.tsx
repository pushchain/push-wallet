import { Box, Button, Search, Text, TextInput } from "blocks";
import React, { FC, useState } from "react";
import { css } from "styled-components";
import { TokenFormat } from "../../../../types";
import { useWalletDashboard } from "../../../../context/WalletDashboardContext";
import { useSendTokenContext } from "../../../../context/SendTokenContext";
import WalletHeader from "../WalletHeader";
import { useTokenManager } from "../../../../hooks/useTokenManager";
import { TokenLogoComponent } from "common";
import TokensListItem from "../TokensListItem";

type SelectTokenProps = {
  handleTokenSelection: (token: TokenFormat) => void;
};
const SelectToken: FC<SelectTokenProps> = ({ handleTokenSelection }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { setActiveState, selectedWallet } = useWalletDashboard();

  const { tokenSelected, setTokenSelected } = useSendTokenContext();

  const { tokens } = useTokenManager();

  const handleSearch = () => {
    if (!searchQuery) return;

    const result = tokens.find(
      (token) =>
        token.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setTokenSelected(result);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <WalletHeader
        selectedWallet={selectedWallet}
        handleBackButton={() => setActiveState("walletDashboard")}
      />

      <Box display="flex" flexDirection="column" gap="spacing-sm">
        <Box
          borderRadius="radius-xs"
          width="100%"
          justifyContent="center"
          alignItems="baseline"
          onKeyDown={handleKeyPress}
          display="flex"
          flexDirection="column"
          gap="spacing-xxs"
        >
          <TextInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search />}
            placeholder="Search Token..."
            css={css`
              color: var(--pw-int-text-primary-color);
              width: 100%;
            `}
          />
          <Text>Search by token name, symbol, or contract address</Text>
        </Box>

        {tokenSelected ? (
          <Box
            display="flex"
            padding="spacing-xs"
            justifyContent="space-between"
            alignSelf="stretch"
            alignItems="center"
            borderRadius="radius-sm"
            border="border-sm solid pw-int-border-secondary-color"
            onClick={() => handleTokenSelection(tokenSelected)}
            cursor="pointer"
          >
            <Box display="flex" gap="spacing-xxs" alignItems="center">
              <TokenLogoComponent tokenSymbol={tokenSelected.symbol} />
              <Box display="flex" flexDirection="column">
                <Text variant="bm-semibold" color="pw-int-text-primary-color">
                  {tokenSelected.name}
                </Text>
                <Text variant="bs-regular" color="pw-int-text-secondary-color">
                  {0} {tokenSelected.symbol}
                </Text>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap="spacing-xxs">
            <Box
              display='flex'
              flexDirection='column'
              gap='spacing-xs'
              overflow="hidden scroll"
              height='240px'
              padding='spacing-none spacing-xs spacing-none spacing-none'
              customScrollbar
            >
              {tokens.map((token: TokenFormat) => (
                <TokensListItem token={token} key={token.address} handleSelectToken={handleTokenSelection} />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box
        display="flex"
        css={css`
          flex: 1;
        `}
        alignItems="flex-end"
      >
        <Button onClick={() => setActiveState("walletDashboard")} block>
          Close
        </Button>
      </Box>
    </>
  );
};

export { SelectToken };
