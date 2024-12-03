import React, { FC } from "react";
import { css } from "styled-components";
import BlockiesSvg from "blockies-react-svg";
import {
  Box,
  Button,
  Cross,
  HoverableSVG,
  PushLogo,
  Spinner,
  Text,
} from "../../blocks";
import { centerMaskWalletAddress } from "../Common.utils";

export type LoadingContentProps = {
  title: string;
  subTitle: string;
};

const LoadingContent: FC<LoadingContentProps> = ({ title, subTitle }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing-xxs"
      alignItems="center"
      width="100%"
    >
      <Spinner size="large" variant="primary" />
      <Box
        display="flex"
        flexDirection="column"
        textAlign="center"
        gap="spacing-xxxs"
      >
        <Text variant="h3-semibold" color="text-primary">
          {title}
        </Text>
        <Text variant="bs-regular" color="text-secondary">
          {subTitle}
        </Text>
      </Box>
    </Box>
  );
};

export { LoadingContent };
