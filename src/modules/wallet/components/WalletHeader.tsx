import {
    Back,
    Box,
    CaretDown,
    Copy,
    Dropdown,
    Logout,
    Menu,
    MenuItem,
    PushAlpha,
    Settings,
    Text,
    TickCircleFilled,
    Tooltip,
} from "blocks";
import {
    centerMaskWalletAddress,
    getAppParamValue,
    handleCopy,
    usePersistedQuery,
} from "common";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../../constants";
import { useEventEmitterContext } from "../../../context/EventEmitterContext";
import { useGlobalState } from "../../../context/GlobalContext";
import { useWallet } from "../../../context/WalletContext";
import { css } from "styled-components";
import BlockiesSvg from "blockies-react-svg";
import { FC, useState } from "react";
import { convertCaipToObject } from "../Wallet.utils";
import { WalletListType } from "../Wallet.types";
import { useWalletDashboard } from "../WalletContext";

type WalletHeaderProps = {
    selectedWallet: WalletListType;
};

const WalletHeader: FC<WalletHeaderProps> = ({ selectedWallet }) => {
    const { state, dispatch } = useGlobalState();
    const { activeState, setActiveState } = useWalletDashboard();

    const parsedWallet =
        selectedWallet?.address || state?.externalWallet?.address;
    const walletName = selectedWallet?.name ?? "External Wallet";

    const { disconnect } = useWallet();
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

    const { result } = convertCaipToObject(parsedWallet);

    return (
        <Box
            display="flex"
            justifyContent={activeState === "wallet" ? "space-between" : "flex-start"}
            alignItems="center"
            width="-webkit-fill-available"
            gap="spacing-xxs"
        >
            {activeState !== "wallet" && (
                <Box cursor="pointer">
                    <Back
                        size={24}
                        color="icon-primary"
                        onClick={() => setActiveState("wallet")}
                    />
                </Box>
            )}

            {activeState === "wallet" && (
                <Dropdown
                    css={css`
            z-index: 3;
          `}
                    overlay={
                        <Menu>
                            <MenuItem
                                label="Push Testnet Donut"
                                icon={<PushAlpha width={24} height={24} />}
                                onClick={() => {
                                    console.log("Change to testnet donut");
                                }}
                            />
                            <MenuItem
                                label="Push Testnet Sushi"
                                icon={<PushAlpha width={24} height={24} />}
                                onClick={() => {
                                    console.log("Change to testnet sushi");
                                }}
                            />
                        </Menu>
                    }
                >
                    <Box
                        cursor="pointer"
                        display="flex"
                        alignItems="center"
                        gap="spacing-xxxs"
                        padding="spacing-xxxs"
                        borderRadius="radius-sm"
                        backgroundColor="surface-tertiary"
                    >
                        <PushAlpha width={24} height={24} />
                        <CaretDown width={24} height={24} color="icon-primary" />
                    </Box>
                </Dropdown>
            )}

            {activeState === 'receive' && (
                <Box>
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
                        <BlockiesSvg address={parsedWallet} />
                    </Box>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Text variant="bes-semibold">{walletName}</Text>
                    <Box
                        display="flex"
                        gap="spacing-xxxs"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Text variant="os-regular" color="text-tertiary">
                            {centerMaskWalletAddress(result.address, 5)}
                        </Text>

                        <Tooltip title={copied ? "Copy" : "Copied"}>
                            {copied ? (
                                <TickCircleFilled
                                    autoSize
                                    size={14}
                                    color="icon-state-success-bold"
                                />
                            ) : (
                                <Copy
                                    color="icon-tertiary"
                                    size={14}
                                    onClick={() => handleCopy(parsedWallet, setCopied)}
                                />
                            )}
                        </Tooltip>
                    </Box>
                </Box>
            </Box>}

            {activeState === "wallet" && (
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
                                icon={<Logout />}
                                onClick={() => {
                                    handleLogOut();
                                }}
                            />
                        </Menu>
                    }
                >
                    <Box cursor="pointer">
                        <Settings size={24} color="icon-primary" />
                    </Box>
                </Dropdown>
            )}
        </Box>
    );
};

export default WalletHeader;
