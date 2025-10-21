import { Box, Text, Button, Cross } from "../../../blocks";
import { FC, useState } from "react";
import { PoweredByPush } from "../../../common/components";
import { css } from "styled-components";
import { APP_ROUTES } from "../../../constants";
import { getAuthWindowConfig, getOTPEmailAuthRoute, getPushSocialAuthRoute } from "../../Authentication/Authentication.utils";
import { useGlobalState } from "../../../context/GlobalContext";
import { centerMaskWalletAddress } from "../../../common/Common.utils";

type ReauthenticationProps = {
    onCancel: () => void;
}

const Reauthentication: FC<ReauthenticationProps> = ({ onCancel }) => {
    const [loading, setLoading] = useState(false);
    const { state, dispatch } = useGlobalState();

    const handleClose = () => {
        dispatch({ type: "SET_RECONNECT", payload: false });
        onCancel();
    }

    const handleClick = () => {
        const email = localStorage.getItem("pw_user_email");
        setLoading(true);
        if (!email) {
            const backendURL = getPushSocialAuthRoute(
                "google",
                APP_ROUTES.OAUTH_REDIRECT
            );
            window.open(backendURL, "Google OAuth", getAuthWindowConfig());
        } else {
            const backendURL = getOTPEmailAuthRoute(
                email,
                APP_ROUTES.REVERIFY_EMAIL_OTP
            );
            window.open(backendURL, "Email OAuth", getAuthWindowConfig());
        }
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
                    Continue {state.pushWallet ? `as ${centerMaskWalletAddress(state.pushWallet.address)}` : "with google"}
                </Button>
            </Box>

            <PoweredByPush />
        </Box>
    );
};

export { Reauthentication };
