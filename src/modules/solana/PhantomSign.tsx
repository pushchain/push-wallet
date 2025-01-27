import {
  useDynamicContext,
  useWalletOptions,
} from "@dynamic-labs/sdk-react-core";
import { Box, Spinner, Text } from "blocks";
import { WALLET_TO_WALLET_ACTION } from "common";

import React, { useEffect } from "react";

const PhantomSign = () => {
  const { walletOptions } = useWalletOptions();

  const { primaryWallet } = useDynamicContext();

  useEffect(() => {
    if (walletOptions) {
      if (primaryWallet) {
        const messageHandler = (event: MessageEvent) => {
          if (event.origin === window.location.origin) {
            switch (event.data.type) {
              case WALLET_TO_WALLET_ACTION.CLOSE_TAB:
                window.close();
                break;
              default:
                console.warn("Unknown message type:", event.data.type);
            }
          }
        };

        window.addEventListener("message", messageHandler);

        return () => {
          window.removeEventListener("message", messageHandler);
        };
      }
    }
  }, [primaryWallet, walletOptions]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap="spacing-sm"
      height="100vh"
      width="100vw"
      backgroundColor="surface-secondary"
    >
      <Text variant="bl-semibold">Requesting to Sign the Message...</Text>
      <Spinner variant="primary" size="medium" />
    </Box>
  );
};

export { PhantomSign };
