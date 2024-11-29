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
  Skeleton,
  Text,
  Tooltip,
} from "../../../blocks";
import { centerMaskWalletAddress, handleCopy } from "../../../common";
import { useGlobalState } from "../../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useDynamicContext, useWalletItemActions } from "@dynamic-labs/sdk-react-core";
import { WalletListType } from "../Wallet.types";
import { APP_ROUTES } from "../../../constants";

export type WalletProfileProps = {
  selectedWallet: WalletListType;
};

const WalletProfile: FC<WalletProfileProps> = ({
  selectedWallet,
}) => {
  const { primaryWallet, handleLogOut } = useDynamicContext();
  const parsedWallet = selectedWallet?.address || primaryWallet?.address;
  const walletName = selectedWallet?.name ?? "Guest Wallet";
  const [copied, setCopied] = useState(false);

  const { dispatch } = useGlobalState();

  const navigate = useNavigate();

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
                      sessionStorage.removeItem("jwt");
                      dispatch({ type: "RESET_AUTHENTICATED" });
                      dispatch({ type: "RESET_USER" });
                      localStorage.clear();
                      handleLogOut();

                      navigate(APP_ROUTES.AUTH);
                      localStorage.clear();
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

          {/* {!isLoading && ( */}
            <Box cursor="pointer">
              <Tooltip title={copied ? "Copy" : "Copied"} trigger="click">
                <Copy
                  color="icon-tertiary"
                  onClick={() => handleCopy(parsedWallet, setCopied)}
                />
              </Tooltip>
            </Box>
          {/* )} */}
        </Box>
      </Box>
    </Box>
  );
};

export { WalletProfile };
