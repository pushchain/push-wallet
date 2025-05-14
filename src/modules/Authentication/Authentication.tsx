import { useState } from "react";
import { Box } from "../../blocks";
import { BoxLayout, ContentLayout } from "../../common";
import { Footer } from "../../common/components/Footer";
import { Login } from "./components/Login";
import { WalletState } from "./Authentication.types";
import ConnectWallet from "./components/ConnectWallet";
import { useGlobalState } from "../../context/GlobalContext";
import { SplitWalletView } from "./components/SplitWalletView";
import { CONSTANTS } from "../../types/wallet.types";

const Authentication = () => {
  const [email, setEmail] = useState<string>("");
  const [connectMethod, setConnectMethod] =
    useState<WalletState>("authentication");
  const { state } = useGlobalState();

  const showPreviewPane = state.walletConfig?.modalDefaults.loginLayout === CONSTANTS.LOGIN.SPLIT

  return (
    <ContentLayout footer={<Footer />}>

      {showPreviewPane ? (
        <SplitWalletView
          email={email}
          connectMethod={connectMethod}
          setEmail={setEmail}
          setConnectMethod={setConnectMethod}
          walletConfig={state.walletConfig}
        />
      ) : (
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
      )}

    </ContentLayout>
  );
};

export { Authentication };

