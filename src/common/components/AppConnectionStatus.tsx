import { FC } from "react";
import BlockiesSvg from "blockies-react-svg";
import { css } from "styled-components";
import { BellRingFilled, Box, Button, Cross, HoverableSVG, PushLogo, PushMonotone, Text } from "blocks";
import { centerMaskWalletAddress } from "../Common.utils";
import { WalletListType } from "../../modules/wallet/Wallet.types";
import { PushWalletAppConnectionData } from "../Common.types";
import { CHAIN_LOGO, CHAIN_MONOTONE_LOGO } from "../Common.constants";
import { convertCaipToObject } from "../../modules/wallet/Wallet.utils";

export type AppConnectionStatusDrawerProps = {
  selectedWallet: WalletListType;
  appConnection: PushWalletAppConnectionData;
  onSuccess: (origin: string) => void;
  onReject: (origin: string) => void;
  onRejectAll?: () => void;
};

const AppConnectionStatus: FC<AppConnectionStatusDrawerProps> = ({
  selectedWallet,
  appConnection,
  onSuccess,
  onReject,
  onRejectAll,
}) => {
  const address = selectedWallet?.fullAddress;

  const { result } = convertCaipToObject(address);

  function getChainIcon(chainId: string | null) {
    if (!chainId) {
      return <BellRingFilled color="icon-brand-medium" size={20} />
    }
    const IconComponent = CHAIN_LOGO[chainId];
    if (IconComponent) {
      return <IconComponent width={20} height={20} />;
    } else {
      return <BellRingFilled color="icon-brand-medium" size={20} />
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
        {onRejectAll && (
          <Box alignSelf="flex-end" display="flex">
            <HoverableSVG
              onClick={onRejectAll}
              icon={<Cross color="icon-secondary" size={16} />}
            />
          </Box>
        )}
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
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              width="40px"
              height="40px"
              borderRadius="radius-xl"
              overflow="hidden"
              alignSelf="center"
            >
              <BlockiesSvg address={address} />
            </Box>
            <Box
              position="absolute"
              width="20px"
              height="20px"
              css={css`
          bottom:-5px;
          left:60%;
          `}
            >
              {getChainIcon(result.chainId)}
            </Box>

          </Box>
          <Box display="flex" flexDirection="column">
            <Text variant="bm-semibold">Push Wallet</Text>

            <Box display="flex" gap="spacing-xxxs">
              {getMonotoneChainIcon(result.chainId)}

              <Text variant="bes-semibold" color="text-tertiary">
                {centerMaskWalletAddress(result.address)}
              </Text>
            </Box>

          </Box>
        </Box>
        <Box display="flex" gap="spacing-xs">
          <Button
            size="small"
            variant="outline"
            onClick={() => onReject(appConnection?.origin)}
          >
            Reject
          </Button>
          <Button
            size="small"
            variant="primary"
            css={css`
              flex: 1;
            `}
            onClick={() => onSuccess(appConnection?.origin)}
          >
            Connect
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export { AppConnectionStatus };
