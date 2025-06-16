import { Box, Button, Text, TextInput } from "blocks";
import React from "react";
import { TokenLogoComponent } from "common";
import { css } from "styled-components";
import { useWalletDashboard } from "../../../../context/WalletDashboardContext";
import { useSendTokenContext } from "../../../../context/SendTokenContext";
import WalletHeader from "../WalletHeader";

const SelectRecipient = () => {
  const {
    tokenSelected,
    receiverAddress,
    setReceiverAddress,
    amount,
    setAmount,
    setSendState,
    setTokenSelected,
  } = useSendTokenContext();

  const { setActiveState, selectedWallet } = useWalletDashboard();

  return (
    <>
      <WalletHeader
        selectedWallet={selectedWallet}
        handleBackButton={() => {
          setTokenSelected(null);
          setSendState("selectToken");
        }}
      />

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="spacing-md"
        css={css`
          flex: 1;
        `}
      >
        <Text variant="h3-semibold" color="pw-int-text-primary-color">
          Send PC{" "}
        </Text>

        <Box
          display="flex"
          padding="spacing-xs"
          justifyContent="space-between"
          alignSelf="stretch"
          alignItems="center"
          borderRadius="radius-sm"
          border="border-sm solid pw-int-border-secondary-color"
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

        <Box
          borderRadius="radius-xs"
          width="100%"
          justifyContent="center"
          alignItems="baseline"
          display="flex"
          flexDirection="column"
          gap="spacing-xxs"
        >
          <TextInput
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="Recipient's Push Chain Address"
            css={css`
              color: white;
              width: 100%;
            `}
          />
          <Text>
            Only send to Push chain addresses. Other networks may result in lost
            tokens
          </Text>
        </Box>

        <Box
          display="flex"
          padding="spacing-xs spacing-sm"
          flexDirection="column"
          alignItems="flex-start"
          borderRadius="radius-sm"
          backgroundColor="pw-int-bg-tertiary-color"
        >
          <Text variant="bes-semibold" color="pw-int-text-primary-color">
            Tokens to Send
          </Text>
          <Box display="flex" alignItems="center" gap="spacing-sm" width="100%">
            <TextInput
              value={amount}
              type="number"
              onChange={(e) => setAmount(Number(e.target.value))}
              css={css`
                color: white;
                & input {
                  font-size: 26px !important;
                  &::-webkit-inner-spin-button,
                  &::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                  }
                  -moz-appearance: textfield;
                }
              `}
            />

            <Box
              display="flex"
              padding="spacing-xxs spacing-xs"
              alignItems="center"
              backgroundColor="pw-int-bg-secondary-color"
              borderRadius="radius-md"
              onClick={() => setAmount(Number(0))}
            >
              <Text variant="bs-semibold" color="pw-int-text-primary-color">
                Max
              </Text>
            </Box>
          </Box>
          <Box display="flex" width="100%">
            <Box
              css={css`
                flex: 1;
              `}
            >
              <Text variant="bs-regular" color="pw-int-text-tertiary-color">
                ~$12.45
              </Text>
            </Box>
            <Box
              css={css`
                flex: 1;
              `}
            >
              <Text
                textAlign="right"
                variant="bs-regular"
                color="pw-int-text-tertiary-color"
              >
                Balance: 124.53
              </Text>
            </Box>
          </Box>
        </Box>

        <Box
          display="flex"
          gap="spacing-xs"
          css={css`
            flex: 1;
          `}
          width="100%"
          alignItems="flex-end"
        >
          <Button
            variant="outline"
            css={css`
              flex: 1;
            `}
            onClick={() => setActiveState("walletDashboard")}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (receiverAddress && amount) {
                setSendState("review");
              }
            }}
            css={css`
              flex: 2;
            `}
            disabled={!receiverAddress || !amount}
          >
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SelectRecipient;
