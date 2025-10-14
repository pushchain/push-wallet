import { FC } from "react";
import { Box, Link, Text } from "../../blocks";
import React from "react";

const Footer: FC = () => {
  return (
    <Box textAlign="center" width="280px">
      <Text as="span" variant="bes-semibold" color="pw-int-text-secondary-color">
        By using Push Wallet, you agree to our{" "}
      </Text>
      <Link
        to="https://push.org/tos/"
        target="_blank"
        textProps={{
          as: "span",
          variant: "bes-semibold",
          color: "pw-int-brand-primary-subtle-color",
        }}
      >
        Terms of Service{" "}
      </Link>
      <Text as="span" variant="bes-semibold" color="pw-int-text-secondary-color">
        and{" "}
      </Text>
      <Link
        to="https://push.org/privacy/"
        target="_blank"
        textProps={{
          as: "span",
          variant: "bes-semibold",
          color: "pw-int-brand-primary-subtle-color",
        }}
      >
        Privacy Policy
      </Link>
    </Box>
  );
};

export { Footer };
