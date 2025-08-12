import { css } from "styled-components";
import { Box, Cross, Text, Tick } from "blocks";

const ConnectionSuccess = ({ onClose }) => {
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
        <Cross size={16} color="pw-int-icon-primary-color" />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor="pw-int-success-primary-subtle-color"
        borderRadius="radius-sm"
        width="48px"
        height="48px"
        cursor="pointer"
      >
        <Tick size={32} color="pw-int-success-primary-color" />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        textAlign="center"
        gap="spacing-xxxs"
      >
        <Text variant="h3-semibold" color="pw-int-text-primary-color">
          Logged in Successfully
        </Text>
        <Text variant="bs-regular" color="pw-int-text-secondary-color">
          You can now return to the app to continue
        </Text>
      </Box>
      <Text variant="bs-regular" color="pw-int-text-tertiary-color">
        Closing this window will log you out.
      </Text>
    </Box>
  );
};

export { ConnectionSuccess };
