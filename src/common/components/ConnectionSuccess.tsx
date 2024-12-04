import { Box, Button, Cross, Text, Tick } from "blocks";
import React from "react";
import { css } from "styled-components";

const ConnectionSuccess = ({
    onClose
}) => {
    const onRetry = () => { };
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
                <Cross size={16} color="icon-primary" />
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                backgroundColor="surface-state-success-subtle"
                borderRadius="radius-sm"
                width="48px"
                height="48px"
                cursor="pointer"
            >
                <Tick size={32} color="icon-state-success-bold" />
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                textAlign="center"
                gap="spacing-xxxs"
            >
                <Text variant="h3-semibold" color="text-primary">
                    Logged in Successfully
                </Text>
                <Text variant="bs-regular" color="text-secondary">
                    You can now return to the app to continue
                </Text>
            </Box>
            <Box display="flex" width="100%" padding="spacing-none spacing-md">
                <Button block variant="outline" onClick={() => onRetry()}>
                    Return to the app
                </Button>
            </Box>
            <Text variant="bs-regular" color="text-tertiary">
                Closing this window will log you out.
            </Text>
        </Box>
    );
};

export { ConnectionSuccess };
