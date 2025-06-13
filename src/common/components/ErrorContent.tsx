import React, { FC, ReactNode } from "react";
import { css } from "styled-components";
import { Box, Button, Cross, Text } from "../../blocks";

export type ErrorContentProps = {
  title: string;
  subTitle: string;
  retryText?: string;
  onClose?: () => void;
  onRetry?: () => void;
  note?: string;
  icon?: ReactNode;
};

const ErrorContent: FC<ErrorContentProps> = ({
  title,
  subTitle,
  retryText = "Retry",
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
      backgroundColor="pw-int-bg-primary-color"
      css={css`
        border-top: var(--border-xmd) solid var(--pw-int-border-secondary-color);
      `}
    >
      {onClose && (
        <Box alignSelf="flex-end" cursor="pointer" onClick={onClose}>
          <Cross size={16} color="pw-int-icon-primary-color" />
        </Box>
      )}
      {icon && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundColor="pw-int-error-primary-subtle-color"
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
        <Text variant="h3-semibold" color="pw-int-text-primary-color">
          {title}
        </Text>
        <Text variant="bs-regular" color="pw-int-text-secondary-color">
          {subTitle}
        </Text>
      </Box>
      <Box display="flex" width="100%" padding="spacing-none spacing-md">
        {onRetry && (
          <Button block onClick={onRetry}>
            {retryText}
          </Button>
        )}
      </Box>
      {note && (
        <Text variant="bs-regular" color="pw-int-text-tertiary-color">
          {note}
        </Text>
      )}
    </Box>
  );
};

export { ErrorContent };
