import { useState } from "react";
import { Box } from "../../blocks";
import { BoxLayout, ContentLayout } from "../../common";
import { Footer } from "../../common/components/Footer";
import { Login } from "./components/Login";
import { WalletState } from "./Authentication.types";
import ConnectWallet from "./components/ConnectWallet";
import { useGlobalState } from "../../context/GlobalContext";

const Authentication = () => {
  const [email, setEmail] = useState<string>("");
  const [connectMethod, setConnectMethod] =
    useState<WalletState>("authentication");
  const { state } = useGlobalState();
  console.log("State >>>>", state.walletConfig);


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
                walletConfig={state.walletConfig}
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
