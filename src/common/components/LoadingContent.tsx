import React, { FC } from "react";
import { css } from "styled-components";
import { Box, Cross, Spinner, Text } from "../../blocks";

export type LoadingContentProps = {
  title: string;
  subTitle: string;
  onClose?: () => void;
};

const LoadingContent: FC<LoadingContentProps> = ({
  title,
  subTitle,
  onClose,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="spacing-xs"
      gap="spacing-sm"
      width="100%"
      borderRadius="radius-md"
      backgroundColor="pw-int-bg-primary-color"
      css={css`
        border-top: var(--border-xmd) solid var(--pw-int-border-secondary-color);
      `}
    >
      
        <Box alignSelf="flex-end" cursor="pointer" onClick={() => onClose()}>
       {onClose &&   <Cross size={16} color="pw-int-icon-primary-color" />}
        </Box>
  
      <Spinner size="large" variant="primary" />
      <Box
        display="flex"
        flexDirection="column"
        textAlign="center"
        gap="spacing-xxxs"
        margin="spacing-none spacing-none spacing-md spacing-none"
      >
        <Text variant="h3-semibold" color="pw-int-text-primary-color">
          {title}
        </Text>
        <Text variant="bs-regular" color="pw-int-text-secondary-color">
          {subTitle}
        </Text>
      </Box>
    </Box>
  );
};

export { LoadingContent };
