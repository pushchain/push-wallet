import { useState } from "react";
import { Box } from "../../blocks";
import { BoxLayout, ContentLayout } from "../../common";
import { Footer } from "../../common/components/Footer";
import { Login } from "./components/Login";
import { WalletState } from "./Authentication.types";
import ConnectWallet from "./components/ConnectWallet";

const Authentication = () => {
  const [email, setEmail] = useState<string>("");
  const [connectMethod, setConnectMethod] =
    useState<WalletState>("authentication");

  return (
    <ContentLayout footer={<Footer />}>
      <BoxLayout>
        <Box
          alignItems="center"
          flexDirection="column"
          display="flex"
          width={{ initial: "376px", ml: "100%" }}
          padding="spacing-md"
        >
          {(connectMethod === "authentication" ||
            connectMethod === "social") && (
              <Login
                email={email}
                setEmail={setEmail}
                setConnectMethod={setConnectMethod}
              />
            )}
          {connectMethod === "connectWallet" && (
            <ConnectWallet setConnectMethod={setConnectMethod} />
          )}
        </Box>
      </BoxLayout>
    </ContentLayout>
  );
};

export { Authentication };
