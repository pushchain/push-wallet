import { useEffect, useState } from "react";
import { Box } from "../../blocks";
import { BoxLayout, ContentLayout } from "../../common";
import { Footer } from "../../common/components/Footer";
import { Login } from "./components/Login";
import { WalletSelection } from "./components/WalletSelection";
import { WalletState } from "./Authentication.types";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const [email, setEmail] = useState<string>("");
  const [connectMethod, setConnectMethod] =
    useState<WalletState>("authentication");
  const { primaryWallet } = useDynamicContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (primaryWallet) navigate("/");
  }, [primaryWallet]);
  return (
    <ContentLayout footer={<Footer />}>
      <BoxLayout>
        <Box
          alignItems="center"
          flexDirection="column"
          display="flex"
          width="376px"
          padding="spacing-md"
        >
          {connectMethod === "authentication" && (
            <Login
              email={email}
              setEmail={setEmail}
              setConnectMethod={setConnectMethod}
            />
          )}
          {/* <VerifyCode/> */}
          {connectMethod === "connectWallet" && (
            <WalletSelection setConnectMethod={setConnectMethod} />
          )}
        </Box>
      </BoxLayout>
    </ContentLayout>
  );
};

export { Authentication };
