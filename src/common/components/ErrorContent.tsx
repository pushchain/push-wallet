import React, { FC, ReactNode } from "react";
import { css } from "styled-components";
import { Box, Button, Cross, Info, Text } from "../../blocks";

export type ErrorContentProps = {
  title: string;
  subTitle: string;
  onClose: () => void;
  onRetry?: () => void;
  note?: string;
  icon?: ReactNode;
};

const ErrorContent: FC<ErrorContentProps> = ({
  title,
  subTitle,
  onClose,
  onRetry,
  note,
  icon,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="spacing-xs spacing-xs spacing-md spacing-xs"
      gap="spacing-sm"
      width="-webkit-fill-available"
      borderRadius="radius-md"
      backgroundColor="surface-primary"
      css={css`
        border-top: var(--border-xmd) solid var(--stroke-secondary);
      `}
    >
      <Box alignSelf="flex-end" cursor="pointer" onClick={() => onClose()}>
        <Cross size={16} color="icon-primary" />
      </Box>
      {icon && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundColor="surface-state-danger-subtle"
          borderRadius="radius-sm"
          width="48px"
          height="48px"
          cursor="pointer"
        >
          {icon}
        </Box>
      )}

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
     {onRetry && <Box display='flex' width="100%" padding="spacing-none spacing-md">
        <Button block onClick={() => onRetry()}>
          Retry
        </Button>
      </Box>}
      {note && (
        <Text variant="bs-regular" color="text-tertiary">
          {note}
        </Text>
      )}
    </Box>
  );
};

export { ErrorContent };
