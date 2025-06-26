import { Box, Text } from "blocks";
import React, { FC } from "react";
import {
  ChainType,
  IWalletProvider,
  WalletCategoriesType,
  WalletInfo,
} from "../../../types/wallet.types";
import { css } from "styled-components";
import { useWallet } from "../../../context/WalletContext";
import { getAppParamValue, WALLET_TO_APP_ACTION, WALLETS_LOGO } from "common";
import { useGlobalState } from "../../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../../constants";
import { PushChain } from "@pushchain/core";

interface WalletButtonProps {
  provider: IWalletProvider;
  walletCategory: WalletCategoriesType;
}

const WalletSelector: FC<WalletButtonProps> = ({
  provider,
  walletCategory,
}) => {
  const { connect } = useWallet();

  const navigate = useNavigate();

  const { dispatch } = useGlobalState();

  const isOpenedInIframe = !!getAppParamValue();

  const handleConnect = async (chainType?: ChainType) => {
    if (isOpenedInIframe) {
      window.parent?.postMessage(
        {
          type: WALLET_TO_APP_ACTION.CONNECT_WALLET,
          data: {
            chain: chainType, // evm or solana
            provider: provider.name, // metamask phantom
          },
        },
        getAppParamValue()
      );
    } else {
      try {
        dispatch({
          type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
          payload: "loading",
        });

        const result = await connect(provider, chainType);

        const payload: WalletInfo = {
          address: result,
          chainType: chainType,
          providerName: provider.name,
        };

        console.log("@@@@@@@ walletInfo", payload);

        if (result) {
          const universalAccount =
            PushChain.utils.account.fromChainAgnostic(result);
          console.log("universalAccount >>>", universalAccount);

          dispatch({
            type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
            payload: "success",
          });
          dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "success" });
          dispatch({ type: "SET_EXTERNAL_WALLET", payload: payload });
          navigate(APP_ROUTES.WALLET);
        }
      } catch (error) {
        dispatch({
          type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
          payload: "rejected",
        });
      }
    }
  };

  const handleClick = () => {
    const chainToConnect = provider.supportedChains.find(
      (curr) => curr === walletCategory.chain
    );
    handleConnect(chainToConnect);
  };

  return (
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
      gap="spacing-xxs"
      onClick={() => handleClick()}
    >
      <Box
        width="24px"
        height="24px"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        css={css`
          flex-shrink: 0;
        `}
      >
        {WALLETS_LOGO[provider.name.toLowerCase()] || (
          <FallBackWalletIcon walletKey={provider.name} />
        )}
      </Box>
      <Text variant="bs-semibold" color="pw-int-text-primary-color">
        {provider.name}
      </Text>
    </Box>
  );
};

export default WalletSelector;

const FallBackWalletIcon = ({ walletKey }: { walletKey: string }) => {
  return (
    <Text
      color="pw-int-text-tertiary-color"
      variant="bes-bold"
      textAlign="center"
    >
      {walletKey.slice(0, 2).toUpperCase()}
    </Text>
  );
};
