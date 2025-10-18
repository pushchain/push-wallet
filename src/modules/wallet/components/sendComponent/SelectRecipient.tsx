import { Box, Button, Text, TextInput } from "blocks";
import React, { useState } from "react";
import { TokenLogoComponent, truncateToDecimals } from "common";
import { css } from "styled-components";
import { useWalletDashboard } from "../../../../context/WalletDashboardContext";
import { useSendTokenContext } from "../../../../context/SendTokenContext";
import WalletHeader from "../dashboard/WalletHeader";
import { useTokenBalance } from "../../../../hooks/useTokenBalance";
import { UniversalNameService } from "@miracleorg/universal-name-service";

const uns = new UniversalNameService({
  contractAddress: "0x6032E825069f5C057aFDE606B8BCA9de84742C3D", // your deployed contract
  rpcUrl: "https://evm.rpc-testnet-donut-node1.push.org/",
});

const SelectRecipient = () => {
  const {
    walletAddress,
    tokenSelected,
    receiverAddress,
    setReceiverAddress,
    amount,
    setAmount,
    setSendState,
    setTokenSelected,
  } = useSendTokenContext();

  const { setActiveState } = useWalletDashboard();
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);

  const { data: tokenBalance, isLoading: loadingTokenBalance } =
    useTokenBalance(
      tokenSelected.address,
      walletAddress,
      tokenSelected.decimals
    );

  // 🔹 Handle PushNS name resolution
  const handleRecipientChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setReceiverAddress(value);

  // Only resolve if it ends with `.push`
  if (value.endsWith('.push')) {
    try {
      const cleanName = value.replace('.push', '');
      const resolvedAddress = await uns.resolveName(cleanName);
      console.log("Resolved address:", resolvedAddress);

      if (resolvedAddress) {
        setReceiverAddress(resolvedAddress);
      } else {
        console.warn("No address found for this name");
      }
    } catch (err) {
      console.error("Error resolving name with UNS:", err);
    }
  }
};


  return (
    <>
      <WalletHeader
        walletAddress={walletAddress}
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
          Send PC
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
                {loadingTokenBalance
                  ? "0"
                  : Number(
                      truncateToDecimals(Number(tokenBalance ?? "0"), 3)
                    ).toLocaleString()}{" "}
                {tokenSelected.symbol}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* 🔹 Recipient Input */}
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
            onChange={handleRecipientChange}
            placeholder="Recipient's Push Chain Address or PNs"
            css={css`
              color: white;
              width: 100%;
            `}
          />

          {/* 🔹 Resolution Feedback */}
          {resolving && (
            <Text color="pw-int-text-secondary-color" variant="bs-regular">
              Resolving name...
            </Text>
          )}
          {resolvedAddress && (
            <Text color="pw-int-text-success-bold-color" variant="bs-regular">
              Resolved: {resolvedAddress.slice(0, 6)}...
              {resolvedAddress.slice(-4)}
            </Text>
          )}

          <Text variant="bs-regular" color="pw-int-text-tertiary-color">
            Only send to Push chain addresses. Other networks may result in lost
            tokens
          </Text>
        </Box>

        {/* 🔹 Amount Input */}
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
              placeholder="0"
              onChange={(e) => setAmount(e.target.value)}
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
              onClick={() =>
                setAmount(
                  truncateToDecimals(Number(tokenBalance), 3).toString()
                )
              }
              cursor="pointer"
            >
              <Text variant="bs-semibold" color="pw-int-text-primary-color">
                Max
              </Text>
            </Box>
          </Box>

          <Box display="flex" width="100%">
            <Box
              css={css`
                flex: 2;
              `}
            >
              <Text
                textAlign="right"
                variant="bs-regular"
                color="pw-int-text-tertiary-color"
              >
                Balance: {truncateToDecimals(Number(tokenBalance), 3)}{" "}
                {tokenSelected.symbol}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* 🔹 Buttons */}
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
              const finalRecipient = resolvedAddress || receiverAddress;
              if (
                finalRecipient &&
                amount &&
                !isNaN(Number(amount)) &&
                Number(amount) > 0 &&
                Number(amount) <= Number(tokenBalance)
              ) {
                setReceiverAddress(finalRecipient);
                setSendState("review");
              }
            }}
            css={css`
              flex: 2;
            `}
            disabled={
              !receiverAddress ||
              !amount ||
              isNaN(Number(amount)) ||
              Number(amount) <= 0 ||
              Number(amount) > Number(tokenBalance)
            }
          >
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SelectRecipient;
