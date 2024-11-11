import { FC, ReactNode } from "react";
import { Box, Text } from "../../blocks";
import { css } from "styled-components";
import React from "react";

const Footer: FC = () => {
  return (
    <Box gap="spacing-xxxs" textAlign='center' width="280px">
      <Text as="span" variant="bes-regular" color="text-secondary">
        By using Push Wallet, you agree to our{" "}
      </Text>
      <Text as="span" variant="bes-regular" color="text-brand-medium">
        Terms of Service{" "}
      </Text>
      <Text as="span" variant="bes-regular" color="text-secondary">
        and{" "}
      </Text>
      <Text as="span" variant="bes-regular" color="text-brand-medium">
        Privacy Policy
      </Text>
    </Box>
  );
};

export { Footer };
