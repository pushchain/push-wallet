import React, { FC } from "react";
import { css } from "styled-components";
import BlockiesSvg from "blockies-react-svg";
import { Box, Button, Cross, HoverableSVG, PushLogo, Text } from "../../blocks";
import { centerMaskWalletAddress } from "../Common.utils";
import { WalletListType } from "../../modules/wallet/Wallet.types";
import { useGlobalState } from "../../context/GlobalContext";
import { AppConnection } from "../../services/pushWallet/pushWallet.types";
import { DrawerWrapper } from "./DrawerWrapper";

export type AppConnectionsProps = {
  selectedWallet: WalletListType;
  appConnection: AppConnection;
};

const AppConnections: FC<AppConnectionsProps> = ({
  selectedWallet,
  appConnection,
}) => {
  const address = selectedWallet?.fullAddress;

  const { state, dispatch } = useGlobalState();

  const handleAccept = (origin: string) => {
    if (state.wallet) {
      state?.wallet?.acceptConnectionReq(origin);
      dispatch({ type: "INITIALIZE_WALLET", payload: state.wallet });
    }
  };

  const handleReject = (origin: string) => {
    if (state.wallet) {
      state?.wallet?.rejectConnectionReq(origin);
      dispatch({ type: "INITIALIZE_WALLET", payload: state.wallet });
    }
  };

  const handleRejectAllConnections = async () => {
    if (state.wallet) {
      state?.wallet?.rejectAllConnectionReqs();
      dispatch({ type: "INITIALIZE_WALLET", payload: state.wallet });
    }
  };

  return (
    <DrawerWrapper>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding="spacing-xs"
        gap="spacing-md"
        width="-webkit-fill-available"
        borderRadius="radius-md"
        backgroundColor="surface-primary"
        css={css`
          border-top: var(--border-xmd) solid var(--stroke-secondary);
        `}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap="spacing-xxs"
          alignItems="center"
          width="100%"
        >
          <Box alignSelf="flex-end" display="flex">
            <HoverableSVG
              onClick={handleRejectAllConnections}
              icon={<Cross color="icon-secondary" size={16} />}
            />
          </Box>
          <Box
            display="flex"
            css={css`
              background: #fff;
            `}
            height="52px"
            width="52px"
            justifyContent="center"
            alignItems="center"
            borderRadius="radius-xl"
          >
            <PushLogo height={32} width={32} />
          </Box>
          <Text variant="h6-regular" textAlign="center">
            {appConnection?.origin}
          </Text>
        </Box>
        <Box display="flex" flexDirection="column" gap="spacing-xxxs">
          <Text variant="h4-semibold" textAlign="center">
            Connect to this site
          </Text>
          <Text variant="bs-regular" textAlign="center" color="text-tertiary">
            Allow the site to see account balance,
            <br /> activity and suggest transactions to approve
          </Text>
        </Box>

        <Box
          display="flex"
          padding="spacing-xs"
          gap="spacing-sm"
          borderRadius="radius-sm"
          backgroundColor="surface-secondary"
          flexDirection="column"
          width="100%"
        >
          <Box display="flex" gap="spacing-xs">
            <Box
              width="40px"
              height="40px"
              borderRadius="radius-xl"
              overflow="hidden"
              alignSelf="center"
            >
              <BlockiesSvg address={"321ed12e"} />
            </Box>
            <Box display="flex" flexDirection="column">
              <Text variant="bm-semibold">Push Wallet</Text>
              <Text variant="bes-semibold" color="text-tertiary">
                {centerMaskWalletAddress(address)}
              </Text>
            </Box>
          </Box>
          <Box display="flex" gap="spacing-xs">
            <Button
              size="small"
              variant="outline"
              onClick={() => handleReject(appConnection?.origin)}
            >
              Reject
            </Button>
            <Button
              size="small"
              variant="primary"
              css={css`
                width: 66%;
              `}
              onClick={() => handleAccept(appConnection?.origin)}
            >
              Connect
            </Button>
          </Box>
        </Box>
      </Box>
    </DrawerWrapper>
  );
};

export { AppConnections };
