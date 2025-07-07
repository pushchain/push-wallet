import { FC, useState } from "react";
import BlockiesSvg from "blockies-react-svg";
import {
  BellRingFilled,
  Box,
  Copy,
  Dropdown,
  Logout,
  Menu,
  MenuItem,
  PushMonotone,
  Settings,
  Text,
  TickCircleFilled,
  Tooltip,
} from "../../../blocks";
import {
  centerMaskWalletAddress,
  CHAIN_LOGO,
  CHAIN_MONOTONE_LOGO,
  getAppParamValue,
  handleCopy,
  usePersistedQuery,
} from "../../../common";
import { useGlobalState } from "../../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { WalletListType } from "../Wallet.types";
import { APP_ROUTES } from "../../../constants";
import { useEventEmitterContext } from "../../../context/EventEmitterContext";
import { useWallet } from "../../../context/WalletContext";
import { convertCaipToObject } from "../Wallet.utils";
import { css } from "styled-components";

export type WalletProfileProps = {
  selectedWallet: WalletListType;
};

const WalletProfile: FC<WalletProfileProps> = ({ selectedWallet }) => {
  const { state, dispatch } = useGlobalState();

  const { disconnect } = useWallet();

  const parsedWallet = selectedWallet?.address || state?.externalWallet?.address;
  const walletName = selectedWallet?.name ?? "External Wallet";
  const [copied, setCopied] = useState(false);

  const { handleLogOutEvent } = useEventEmitterContext();

  const navigate = useNavigate();

  const persistQuery = usePersistedQuery();

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

  function getChainIcon(chainId: string | null) {
    if (!chainId) {
      return <BellRingFilled color="pw-int-brand-primary-color" size={36} />
    }
    const IconComponent = CHAIN_LOGO[chainId];
    if (IconComponent) {
      return <IconComponent />;
    } else {
      return <BellRingFilled color="pw-int-brand-primary-color" />
    }
  }

  function getMonotoneChainIcon(chainId: string | null) {
    if (!chainId) {
      return <PushMonotone />;
    }
    const IconComponent = CHAIN_MONOTONE_LOGO[chainId];
    if (IconComponent) {
      return <IconComponent />;
    } else {
      return <PushMonotone />;
    }
  }


  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing-sm"
      width="-webkit-fill-available"
    >
      <Box
        display="flex"
        justifyContent="end"
        width="-webkit-fill-available"
      >
        <Box display="flex" gap="spacing-xxs">
          {/* <HoverableSVG icon={<Lock size={24} color="pw-int-icon-primary-color" />} /> */}
          <Dropdown
            css={css`
              z-index:3;
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
              <Settings size={24} color="pw-int-icon-primary-color" />
            </Box>
          </Dropdown>
        </Box>
      </Box>

      <Box
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          width="56px"
          height="56px"
          borderRadius="radius-xl"
          overflow="hidden"
          alignSelf="center"
        >
          <BlockiesSvg address={parsedWallet} />
        </Box>
        <Box
          position="absolute"
          css={css`
          bottom:-12px;
          right:50%;
          left:52%;
          `}
        >
          {getChainIcon(result.chainId)}
        </Box>

      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="spacing-xxxs"
      >
        <Text variant="bl-semibold">{walletName}</Text>
        <Box display="flex" gap="spacing-xxxs">
          {getMonotoneChainIcon(result.chainId)}

          <Text variant="bes-semibold" color="pw-int-text-tertiary-color">
            {centerMaskWalletAddress(result.address)}
          </Text>

          <Box cursor="pointer">
            <Tooltip title={copied ? "Copy" : "Copied"}>
              {copied ? (
                <TickCircleFilled
                  autoSize
                  size={16}
                  color="pw-int-success-primary-color"
                />
              ) : (
                <Copy
                  color="pw-int-icon-tertiary-color"
                  onClick={() => handleCopy(result.address, setCopied)}
                />
              )}
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { WalletProfile };
