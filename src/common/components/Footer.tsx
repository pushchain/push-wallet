import { FC, ReactNode } from "react";
import { Box, Link, Text } from "../../blocks";
import { css } from "styled-components";
import React from "react";

const Footer: FC = () => {
  return (
    <Box textAlign="center" width="280px">
      <Text as="span" variant="bes-semibold" color="text-secondary">
        By using Push Wallet, you agree to our{" "}
      </Text>
      <Link
        to="https://push.org/tos/"
        target="_blank"
        textProps={{
          as: "span",
          variant: "bes-semibold",
          color: "text-brand-medium",
        }}
      >
        Terms of Service{" "}
      </Link>
      <Text as="span" variant="bes-semibold" color="text-secondary">
        and{" "}
      </Text>
      <Link
        to="https://push.org/privacy/"
        target="_blank"
        textProps={{
          as: "span",
          variant: "bes-semibold",
          color: "text-brand-medium",
        }}
      >
        Privacy Policy
      </Link>
    </Box>
  );
};

export { Footer };
