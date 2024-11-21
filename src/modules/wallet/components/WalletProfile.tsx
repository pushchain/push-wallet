import { FC, useState } from "react";
import BlockiesSvg from "blockies-react-svg";
import {
  Asterisk,
  Box,
  Copy,
  Cube,
  Dropdown,
  HoverableSVG,
  Link,
  Lock,
  Logout,
  Menu,
  MenuItem,
  Pin,
  PushLogo,
  Settings,
  Text,
  Tooltip,
} from "../../../blocks";
import { centerMaskWalletAddress } from "../../../common";
import { useGlobalState } from "../../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export type WalletProfileProps = {};

//name of wallet 
const WalletProfile: FC<WalletProfileProps> = () => {
  const { state } = useGlobalState();
  const { primaryWallet } = useDynamicContext();
  const parsedWallet =
    state?.wallet?.signerAccount?.split(":")?.[2] || primaryWallet?.address;
  const walletName = state?.wallet ? "Push Wallet" : "Guest Wallet";
  console.debug(primaryWallet,state);
  const [copied, setCopied] = useState(false);

  const { dispatch } = useGlobalState();

  const navigate = useNavigate();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
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
          <HoverableSVG icon={<Lock size={24} color="icon-primary" />} />
          <Dropdown
            overlay={
              <Menu>
                <MenuItem label="Linked Accounts" icon={<Pin />} />
                <MenuItem label="App Permissions" icon={<Cube />} />
                <MenuItem label="Passkeys" icon={<Lock />} />
                <MenuItem label="Secret Recovery Phrase" icon={<Asterisk />} />
                <MenuItem
                  label="Log Out"
                  icon={<Logout />}
                  onClick={() => {
                    sessionStorage.removeItem("jwt");
                    dispatch({ type: "RESET_AUTHENTICATED" });
                    dispatch({ type: "RESET_USER" });
                    navigate("/auth");
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
      <Box display="flex" flexDirection="column" alignItems="center">
        <Text variant="bl-semibold">{walletName}</Text>
        <Box display="flex" gap="spacing-xxxs">
          <Text variant="bes-semibold" color="text-tertiary">
            {centerMaskWalletAddress(parsedWallet)}
          </Text>
          <Box cursor="pointer">
            <Tooltip title={copied ? "Copy" : "Copied"} trigger="click">
              <Copy
                color="icon-tertiary"
                onClick={() => handleCopy(parsedWallet)}
              />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { WalletProfile };
