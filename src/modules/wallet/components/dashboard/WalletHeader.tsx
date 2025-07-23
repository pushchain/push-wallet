import {
    Back,
    Box,
    Copy,
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
    getAppParamValue,
    handleCopy,
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
    const { dispatch } = useGlobalState();
    const { activeState } = useWalletDashboard();

    const { disconnect } = useExternalWallet();
    const navigate = useNavigate();
    const persistQuery = usePersistedQuery();
    const { handleLogOutEvent } = useEventEmitterContext();
    const [copied, setCopied] = useState(false);

    const isOpenedInIframe = !!getAppParamValue();

    const handleLogOut = () => {
        dispatch({ type: "RESET_WALLET" });

        disconnect();

        sessionStorage.removeItem("jwt");

        navigate(persistQuery(APP_ROUTES.AUTH));

        if (isOpenedInIframe) {
            handleLogOutEvent();
        }
    };


    return (
        <Box
            display="flex"
            justifyContent={activeState === "walletDashboard" ? "space-between" : "flex-start"}
            alignItems="center"
            width="100%"
            gap="spacing-xxs"
        >
            {handleBackButton && (
                <Box cursor="pointer">
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
                        <Text variant="os-regular" color="pw-int-text-tertiary-color">
                            {centerMaskWalletAddress(walletAddress, 5)}
                        </Text>
                        <Box
                            cursor="pointer"
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
                                />
                            )}

                        </Box>
                    </Box>
                </Box>
            </Box>}

            {activeState === "walletDashboard" && (
                <Dropdown
                    css={css`
            z-index: 3;
          `}
                    overlay={
                        <Menu>
                            {/* <MenuItem label="Linked Accounts" icon={<Pin />} /> */}
                            {/* <MenuItem label="App Permissions" icon={<Cube />} /> */}
                            {/* <MenuItem label="Passkeys" icon={<Lock />} /> */}
                            {/* <MenuItem label="Secret Recovery Phrase" icon={<Asterisk />} /> */}
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
                    <Box cursor="pointer">
                        <Settings size={24} color="pw-int-icon-primary-color" />
                    </Box>
                </Dropdown>
            )}
        </Box>
    );
};

export default WalletHeader;
