import { FC, ReactNode } from "react";
import { Box, Text } from "../../blocks";
import { css } from "styled-components";
import React from "react";

const Footer: FC = () => {
  return (
    <Box textAlign='center' width="280px">
      <Text as="span" variant="bes-semibold" color="text-secondary">
        By using Push Wallet, you agree to our{" "}
      </Text>
      <Text as="span" variant="bes-semibold" color="text-brand-medium">
        Terms of Service{" "}
      </Text>
      <Text as="span" variant="bes-semibold" color="text-secondary">
        and{" "}
      </Text>
      <Text as="span" variant="bes-semibold" color="text-brand-medium">
        Privacy Policy
      </Text>
    </Box>
  );
};

export { Footer };
