import { FC } from "react";
import { Box, Text } from "blocks";
import { TokenFormat } from "../../../types";
import { TokenLogoComponent, truncateToDecimals } from "common";
import { useTokenBalance } from "../../../hooks/useTokenBalance";
import { usePushChain } from "../../../hooks/usePushChain";

type TokenListItemProps = {
  token: TokenFormat;
  handleSelectToken?: (token: TokenFormat) => void;
};

const TokensListItem: FC<TokenListItemProps> = ({ token, handleSelectToken }) => {

  const { executorAddress } = usePushChain();

  const {
    data: tokenBalance,
    isLoading: loadingTokenBalance
  } = useTokenBalance(token.address, executorAddress, token.decimals);

  return (
    <Box
      display="flex"
      padding="spacing-xs"
      justifyContent="space-between"
      alignSelf="stretch"
      alignItems="center"
      borderRadius="radius-sm"
      border="border-sm solid pw-int-border-secondary-color"
      onClick={() => handleSelectToken(token)}
      cursor={handleSelectToken && 'pointer'}
    >
      <Box display="flex" gap="spacing-xxs" alignItems="center">
        <TokenLogoComponent tokenSymbol={token.symbol} />
        <Box display="flex" flexDirection="column">
          <Text variant="bm-semibold" color="pw-int-text-primary-color">
            {token.name}
          </Text>
          <Text variant="bs-regular" color="pw-int-text-secondary-color">
            {loadingTokenBalance
              ? '0'
              : Number(truncateToDecimals(Number(tokenBalance ?? '0'), 3)).toLocaleString()
            } {token.symbol}
          </Text>
        </Box>
      </Box>

      {/* <Box
        display="flex"
        flexDirection="column"
        justifyContent="end"
        alignItems="end"
      >
        <Text variant="bm-semibold" color="pw-int-text-primary-color">
          ${Number("12045").toLocaleString()}
        </Text>
        <Text
          variant="c-semibold"
          color={
            "+1984".includes("+")
              ? "pw-int-text-success-bold-color"
              : "pw-int-text-danger-bold-color"
          }
        >
          +{Number("1984").toLocaleString()}
        </Text>
      </Box> */}
    </Box>
  );
};

export { TokensListItem };
