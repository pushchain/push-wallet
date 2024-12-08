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
      width="-webkit-fill-available"
      borderRadius="radius-md"
      backgroundColor="surface-primary"
      css={css`
        border-top: var(--border-xmd) solid var(--stroke-secondary);
      `}
    >
      
        <Box alignSelf="flex-end" cursor="pointer" onClick={() => onClose()}>
       {onClose &&   <Cross size={16} color="icon-primary" />}
        </Box>
  
      <Spinner size="large" variant="primary" />
      <Box
        display="flex"
        flexDirection="column"
        textAlign="center"
        gap="spacing-xxxs"
        margin="spacing-none spacing-none spacing-md spacing-none"
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
