import {
    Asterisk,
    Back,
    Box,
    CopyFilled,
    Dropdown,
    Logout,
    Menu,
    MenuItem,
    Settings,
    Text,
    TickCircleFilled,
} from "blocks";
import {
    centerMaskWalletAddress,
    EXPLORER_URL,
    getAppParamValue,
    handleCopy,
    isUIKitVersion,
    usePersistedQuery,
} from "common";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../../../constants";
import { useEventEmitterContext } from "../../../../context/EventEmitterContext";
import { useGlobalState } from "../../../../context/GlobalContext";
import { useExternalWallet } from "../../../../context/ExternalWalletContext";
import { css } from "styled-components";
import BlockiesSvg from "blockies-react-svg";
import { FC, useState } from "react";
import { useWalletDashboard } from "../../../../context/WalletDashboardContext";

type WalletHeaderProps = {
    walletAddress: string;
    handleBackButton?: () => void;
};

const WalletHeader: FC<WalletHeaderProps> = ({ walletAddress, handleBackButton }) => {
    const { state, dispatch } = useGlobalState();
    const { activeState, setActiveState } = useWalletDashboard();

    const { disconnect } = useExternalWallet();
    const navigate = useNavigate();
    const persistQuery = usePersistedQuery();
    const { handleLogOutEvent } = useEventEmitterContext();
    const [copied, setCopied] = useState(false);

    const isOpenedInIframe = !!getAppParamValue();

    const showCloseButton = isUIKitVersion('1');

    const handleLogOut = () => {
        dispatch({ type: "RESET_WALLET" });

        disconnect();

        sessionStorage.removeItem("jwt");
        localStorage.removeItem("pw_user_email");
        localStorage.removeItem("walletInfo");

        navigate(persistQuery(APP_ROUTES.AUTH));

        if (isOpenedInIframe) {
            handleLogOutEvent();
        }
    };

    return (
        <Box
            display="flex"
            justifyContent={activeState === "walletDashboard" ? "space-between" : "flex-start"}
            alignItems="flex-start"
            width={showCloseButton ? "90%" : "100%"}
            gap="spacing-xxs"
        >
            {handleBackButton && (
                <Box cursor="pointer" display='flex' alignItems='center' height='100%'>
                    <Back
                        size={24}
                        color="pw-int-icon-primary-color"
                        onClick={handleBackButton}
                    />
                </Box>
            )}

            {activeState === 'receive' && (
                <Box
                    textAlign='center'
                    css={css`flex:1`}
                >
                    <Text variant="h3-semibold">Receive Address</Text>
                </Box>
            )}

            {activeState !== 'receive' && <Box display="flex" gap="spacing-xs">
                <Box
                    position="relative"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box
                        width="28px"
                        height="28px"
                        borderRadius="radius-xl"
                        overflow="hidden"
                        alignSelf="center"
                    >
                        <BlockiesSvg address={walletAddress} />
                    </Box>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Text variant="bes-semibold">Push Chain Wallet</Text>
                    <Box
                        display="flex"
                        gap="spacing-xxxs"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Box
                            display='flex'
                            cursor='pointer'
                            onClick={() => window.open(`${EXPLORER_URL}/address/${walletAddress}`, "_blank")}
                        >
                            <Text
                                variant="os-regular"
                                textTransform="inherit"
                                color="pw-int-text-tertiary-color"
                                css={css`
                                    &:hover {
                                        color: var(--pw-int-brand-primary-color);
                                    }    
                                `}
                            >
                                {centerMaskWalletAddress(walletAddress, 5)}
                            </Text>
                        </Box>
                        <Box
                            cursor="pointer"
                            display='flex'
                        >

                            {copied ? (
                                <TickCircleFilled
                                    autoSize
                                    size={14}
                                    color="pw-int-icon-success-bold-color"
                                />
                            ) : (
                                <CopyFilled
                                    color="pw-int-icon-tertiary-color"
                                    size={14}
                                    onClick={() => handleCopy(walletAddress, setCopied)}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-int-icon-brand-color)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-int-icon-tertiary-color)')}
                                />
                            )}
                        </Box>
                        {/* <Box
                            cursor="pointer"
                            display='flex'
                        >
                            <ExternalLinkIcon
                                autoSize
                                size={16}
                                color="pw-int-icon-tertiary-color"
                                onClick={() => window.open(`${EXPLORER_URL}/address/${walletAddress}`, "_blank")}
                            />
                        </Box> */}
                    </Box>
                </Box>
            </Box>}

            {activeState === "walletDashboard" && (
                <Dropdown
                    css={css`
                        z-index: 3;
                    `}
                    side='bottom'
                    align='end'
                    overlay={
                        <Menu>
                            {/* <MenuItem label="Linked Accounts" icon={<Pin />} /> */}
                            {/* <MenuItem label="App Permissions" icon={<Cube />} /> */}
                            {/* <MenuItem label="Passkeys" icon={<Lock />} /> */}
                            {state.wallet && (<MenuItem
                                label="Secret Recovery Phrase"
                                icon={<Asterisk />}
                                onClick={() => {
                                    setActiveState('recoveryPhrase');
                                }}
                            />)}
                            <MenuItem
                                label="Log Out"
                                icon={<Logout size={24} color="pw-int-icon-primary-color" />}
                                onClick={() => {
                                    handleLogOut();
                                }}
                            />
                        </Menu>
                    }
                >
                    <Box 
                        cursor="pointer"
                    >
                        <Settings size={24} color="pw-int-icon-primary-color" />
                    </Box>
                </Dropdown>
            )}
        </Box>
    );
};

export default WalletHeader;
