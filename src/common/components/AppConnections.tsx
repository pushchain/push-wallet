import React, { FC, ReactNode } from "react";
import { css } from "styled-components";
import BlockiesSvg from "blockies-react-svg";
import { Box, Button, Cross, HoverableSVG, PushLogo, Text } from "../../blocks";
import { centerMaskWalletAddress } from "../Common.utils";

export type AppConnectionsProps = {};

const AppConnections: FC<AppConnectionsProps> = ({}) => {
  return (
    <Box
      position="absolute"
      height="100%"
      width="100%"
      alignItems="flex-end"
      display="flex"
      borderRadius="radius-md"
      css={css`
        background: rgba(0, 0, 0, 0.5);
        bottom: 0;
        left: 0;
        z-index: 10;
      `}
    >
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
            <HoverableSVG icon={<Cross color="icon-secondary" size={16} />} />
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
            alpha.push.org
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
                123123...12323112
                {/* {centerMaskWalletAddress(address)} */}
              </Text>
            </Box>
          </Box>
          <Box display="flex" gap="spacing-xs">
            <Button size="small" variant="outline">
              Reject
            </Button>
            <Button
              size="small"
              variant="primary"
              css={css`
                width: 66%;
              `}
            >
              Connect
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { AppConnections };
