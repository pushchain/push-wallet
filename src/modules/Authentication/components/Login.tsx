import { FC, useEffect } from "react";
import { Box, Button, Text } from "../../../blocks";
import { getAppParamValue, PoweredByPush } from "../../../common";
import { WalletState } from "../Authentication.types";
import { APP_ROUTES } from "../../../constants";
import { usePersistedQuery } from "../../../common/hooks/usePersistedQuery";
import { WalletConfig } from "src/types/wallet.types";
import styled from "styled-components";
import { trimText } from "../../../helpers/AuthHelper";
import { useWaapAuth } from "../../../waap/useWaapAuth";
import { PushChain } from '@pushchain/core';
import { useGlobalState } from "../../../context/GlobalContext";
import {
  waapSignMessage,
  waapSignTypedData,
  waapSignAndSendTransaction,
} from '../../../waap/waapProvider';
import { useNavigate } from "react-router-dom";

export type LoginProps = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setConnectMethod: React.Dispatch<React.SetStateAction<WalletState>>;
  walletConfig: WalletConfig
};

const Login: FC<LoginProps> = ({ setConnectMethod, walletConfig }) => {
  const persistQuery = usePersistedQuery();
  const { loginWithWaapSocial, tryAutoConnect } = useWaapAuth();
  const { state, dispatch } = useGlobalState();

  const navigate = useNavigate();

  const isOpenedInIframe = !!getAppParamValue();

  const handleLogin = async (addr: `0x${string}`) => {
    const w = await PushChain.utils.account.convertExecutorToOriginAccount(addr);

    const instance = {
      signMessage: waapSignMessage,
      signTypedData: waapSignTypedData,
      signAndSendTransaction: waapSignAndSendTransaction,
      account: w.account
    }

    dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "success" });
    dispatch({ type: "INITIALIZE_WALLET", payload: instance });

    localStorage.setItem(
      "walletInfo",
      JSON.stringify(w.account)
    );

    navigate(`${persistQuery(APP_ROUTES.WALLET)}`, {
      replace: true,
    });
  }

  const handleSocialLogin = async () => {
    const result = await loginWithWaapSocial();
    if (!result) return;

    await handleLogin(result.address as `0x${string}`);
  };

  const handleReconnect = async () => {
    if (state?.wallet) return;

    const res = await tryAutoConnect();
    if (!res?.address) return;

    await handleLogin(res.address as `0x${string}`);
  };

  useEffect(() => {
    handleReconnect();
  }, []);

  const showEmailLogin = isOpenedInIframe ? walletConfig?.loginDefaults.email : true
  const showGoogleLogin = isOpenedInIframe ? walletConfig?.loginDefaults.google : true
  const showWalletLogin = isOpenedInIframe ? walletConfig?.loginDefaults.wallet.enabled : true

  return (
    <Box
      alignItems="center"
      flexDirection="column"
      display="flex"
      justifyContent="space-between"
      width="100%"
      gap={walletConfig?.appMetadata ? "spacing-md" : "spacing-xl"}
      margin="spacing-md spacing-none spacing-none spacing-none"
    >
      <Text variant="h3-semibold" color="pw-int-text-primary-color">
        {" "}
        Log in or Sign up
      </Text>
      {walletConfig?.loginDefaults?.appPreview && walletConfig?.appMetadata && (
        <Box
          display='flex'
          gap='spacing-xs'
          alignItems='center'
          flexDirection='column'
        >
          {walletConfig?.appMetadata?.logoURL && <Box
            width="64px"
            height="64px"
          >
            <Image
              src={walletConfig.appMetadata.logoURL}
            />
          </Box>}
          <Box
            display='flex'
            flexDirection='column'
            gap='spacing-xxs'
            alignSelf='stretch'
            alignItems='center'
          >
            <Text
              variant="bl-semibold"
              color="pw-int-text-primary-color"
            >
              {walletConfig.appMetadata.title}
            </Text>
            <Text
              variant="bm-regular"
              color="pw-int-text-secondary-color"
              textAlign="center"
            >
              {trimText(walletConfig.appMetadata.description, 15)}
            </Text>
          </Box>

        </Box>
      )}

      <Box
        flexDirection="column"
        display="flex"
        gap="spacing-lg"
        width="100%"
        alignItems="center"
      >
        <Box
          flexDirection="column"
          display="flex"
          gap="spacing-xs"
          width="100%"
          alignItems="center"
        >
          {showGoogleLogin && (
            <>
              <Button
                variant="outline"
                block
                onClick={handleSocialLogin}
              >
                Continue with Social login
              </Button>
              {/* <Box
            display="flex"
            gap="spacing-xs"
            alignItems="center"
            justifyContent="center"
          >
            {socialLoginConfig.map((social) => (
              <Button
                key={social.name}
                variant="outline"
                iconOnly={social.icon}
                css={css`
                  width: 73px;
                `}
                onClick={() =>
                  handleSocialLogin(
                    social.name as
                    | "github"
                    | "google"
                    | "discord"
                    | "twitter"
                    | "apple"
                  )
                }
              />
            ))}
          </Box> */}

            </>

          )}

          {((showGoogleLogin && showWalletLogin) || (showEmailLogin && showWalletLogin)) && (<Text variant="os-regular" color="pw-int-text-tertiary-color">
            OR
          </Text>)}

          {showWalletLogin && <Button
            variant="outline"
            block
            onClick={() => setConnectMethod("connectWallet")}
          >
            Continue with a Wallet
          </Button>}
        </Box>
        {/* TODO: after functional implementation */}
        {/* <Text variant="bes-semibold" color="text-brand-medium">
          Recover using Secret Key{" "}
        </Text> */}
      </Box>
      <PoweredByPush />
    </Box>
  );
};

export { Login };

const Image = styled.img`
  width:inherit;
  height:inherit;
  border-radius: 16px;
  border: 1px solid var(--pw-int-border-secondary-color, #313338);
`