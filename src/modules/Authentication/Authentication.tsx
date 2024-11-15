import { useState } from "react";
import {
  Box,
  Button,
  Discord,
  Google,
  Text,
  TextInput,
  Twitter,
} from "../../blocks";
import { BoxLayout, ContentLayout, PoweredByPush } from "../../common";
import { Footer } from "../../common/components/Footer";
import { socials } from "./Authentication.constants";
import { Login } from "./components/Login";
import { VerifyCode } from "./components/VerifyCode";
import { WalletSelection } from "./components/WalletSelection";

//formik for email validation
//input arrow fix
//implement steps
//connect the pages
//functional connection
//handle steps of back and next
const Authentication = () => {
  const [email, setEmail] = useState<string>("");
  const [continueWithWallet, setContinueWithWallet] = useState<boolean>(false);

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
        {!email && !continueWithWallet &&  <Login
            email={email}
            setEmail={setEmail}
            continueWithWallet={continueWithWallet}
            setContinueWithWallet={setContinueWithWallet}
          />}
          {/* <VerifyCode/> */}
        {continueWithWallet &&  <WalletSelection/>}
        </Box>
      </BoxLayout>
    </ContentLayout>
  );
};

export { Authentication };
