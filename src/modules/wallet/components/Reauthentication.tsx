import { Box, Text, Button, Cross } from "../../../blocks";
import { FC, useState } from "react";
import { PoweredByPush } from "../../../common/components";
import { css } from "styled-components";
import { APP_ROUTES } from "../../../constants";
import { useGlobalState } from "../../../context/GlobalContext";
import { centerMaskWalletAddress } from "../../../common/Common.utils";
import { useWaapAuth } from "../../../waap/useWaapAuth";
import { PushChain } from "@pushchain/core";
import {
  waapSignMessage,
  waapSignTypedData,
  waapSignAndSendTransaction,
} from '../../../waap/waapProvider';

type ReauthenticationProps = {
    onCancel: () => void;
}

const Reauthentication: FC<ReauthenticationProps> = ({ onCancel }) => {
    const [ loading, setLoading ] = useState(false);
    const { state, dispatch } = useGlobalState();
    const { tryAutoConnect } = useWaapAuth();

    const handleClose = () => {
        dispatch({ type: "SET_RECONNECT", payload: false });
        onCancel();
    }

    const handleClick = async () => {
        if (state?.wallet) return;

        setLoading(true);

        const res = await tryAutoConnect();

        setLoading(false);

        if (!res?.address) return;

        const w = await PushChain.utils.account.convertExecutorToOriginAccount(res.address as `0x${string}`);

        const instance = {
            signMessage: waapSignMessage,
            signTypedData: waapSignTypedData,
            signAndSendTransaction: waapSignAndSendTransaction,
            account: w.account
        }
    
        dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "success" });
        dispatch({ type: "INITIALIZE_WALLET", payload: instance });
        dispatch({ type: "SET_RECONNECT", payload: false });
    
        localStorage.setItem(
            "walletInfo",
            JSON.stringify(w.account)
        );
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding="spacing-xs"
            width="100%"
            borderRadius="radius-md"
            backgroundColor="pw-int-bg-primary-color"
            css={css`
                border-top: var(--border-xmd) solid var(--pw-int-border-secondary-color);
            `}
        >
            <Box position="absolute" alignSelf="flex-end" cursor="pointer" height="16px" onClick={handleClose}>
                <Cross size={16} color="pw-int-icon-primary-color" />
            </Box>
            <Box width="100%" flexDirection="column" display="flex" gap="spacing-lg" padding="spacing-xs spacing-xs spacing-lg spacing-xs">
                <Box flexDirection="column" display="flex" gap='spacing-xxxs' justifyContent="center" alignItems="center">
                    <Text
                        color="pw-int-text-primary-color"
                        variant="h4-semibold"
                    >
                        Welcome back!
                    </Text>
                    <Text
                        color="pw-int-text-secondary-color"
                        variant="bs-regular"
                        textAlign="center"
                    >
                        Please re-authenticate to continue.
                    </Text>
                </Box>

                <Button
                    onClick={handleClick}
                    variant="primary"
                    css={css`
                        width: 100%;
                        margin: 0 auto;
                    `}
                    loading={loading}
                >
                    Continue {state.pushWallet ? `as ${centerMaskWalletAddress(state.pushWallet.address)}` : "with Social Login"}
                </Button>
            </Box>

            <PoweredByPush />
        </Box>
    );
};

export { Reauthentication };
