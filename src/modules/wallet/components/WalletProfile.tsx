import { FC, useState } from "react";
import BlockiesSvg from "blockies-react-svg";
import {
  Box,
  Copy,
  Dropdown,
  Logout,
  Menu,
  MenuItem,
  PushLogo,
  Settings,
  Text,
  TickCircleFilled,
  Tooltip,
} from "../../../blocks";
import {
  centerMaskWalletAddress,
  handleCopy,
  usePersistedQuery,
} from "../../../common";
import { useGlobalState } from "../../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { WalletListType } from "../Wallet.types";
import { APP_ROUTES } from "../../../constants";
import { useEventEmitterContext } from "../../../context/EventEmitterContext";

export type WalletProfileProps = {
  selectedWallet: WalletListType;
};

const WalletProfile: FC<WalletProfileProps> = ({ selectedWallet }) => {
  const { primaryWallet, handleLogOut: dynamicLogOut } = useDynamicContext();
  const parsedWallet = selectedWallet?.address || primaryWallet?.address;
  const walletName = selectedWallet?.name ?? "External Wallet";
  const [copied, setCopied] = useState(false);
  const { dispatch } = useGlobalState();

  const { handleLogOutEvent } = useEventEmitterContext();

  const navigate = useNavigate();

  const persistQuery = usePersistedQuery();

  const handleLogOut = () => {
    dispatch({ type: "RESET_WALLET" });

    primaryWallet?.connector?.endSession();
    dynamicLogOut();

    sessionStorage.removeItem("jwt");

    navigate(persistQuery(APP_ROUTES.AUTH));

    handleLogOutEvent();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing-sm"
      width="-webkit-fill-available"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        width="-webkit-fill-available"
      >
        <PushLogo height={48} width={48} />
        <Box display="flex" gap="spacing-xxs">
          {/* <HoverableSVG icon={<Lock size={24} color="icon-primary" />} /> */}
          <Dropdown
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
        </Box>
      </Box>
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
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="spacing-xxxs"
      >
        <Text variant="bl-semibold">{walletName}</Text>
        <Box display="flex" gap="spacing-xxxs">
          <Text variant="bes-semibold" color="text-tertiary">
            {centerMaskWalletAddress(parsedWallet)}
          </Text>

          <Box cursor="pointer">
            <Tooltip title={copied ? "Copy" : "Copied"}>
              {copied ? (
                <TickCircleFilled
                  autoSize
                  size={16}
                  color="icon-state-success-bold"
                />
              ) : (
                <Copy
                  color="icon-tertiary"
                  onClick={() => handleCopy(parsedWallet, setCopied)}
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
