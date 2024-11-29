import { FC } from "react";

import { useGlobalState } from "../../../context/GlobalContext";
import { Box, Button, Text } from "../../../blocks";
import { PushSigner } from "../../../services/pushSigner/pushSigner";
import { PushWallet } from "../../../services/pushWallet/pushWallet";
import config from "../../../config";
import { ENV } from "../../../constants";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { css } from "styled-components";

export type CreateAccountProps = {
  isLoading: boolean;
  setIsLoading:React.Dispatch<React.SetStateAction<boolean>>
};

const CreateAccount: FC<CreateAccountProps> = ({isLoading,setIsLoading}) => {
  const { primaryWallet } = useDynamicContext();
  const {  dispatch } = useGlobalState();

  const handleMnemonicSignup = async () => {
    try {
      setIsLoading(true);
      const instance = await PushWallet.signUp(config.APP_ENV as ENV);
      await connectWalletToPushAccount(instance);
    } catch (err) {
      alert(err);
    }
  };

  const connectWalletToPushAccount = async (pushWallet: PushWallet | null) => {
    const signer = await PushSigner.initialize(primaryWallet, "DYNAMIC");
    await pushWallet?.connectWalletWithAccount(signer);
    await registerPushAccount(pushWallet);
  };

  const registerPushAccount = async (pushWallet: PushWallet | null) => {
    if (pushWallet) {
      try {
        await pushWallet.registerPushAccount();
        dispatch({ type: "INITIALIZE_WALLET", payload: pushWallet });
      } catch (err) {
        alert(err);
      }
      setIsLoading(false);
    }
  };
  const handlePushWalletCreation = async () => {
    await handleMnemonicSignup();
  };

  return (
    <Box
      padding="spacing-xs"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      borderRadius="radius-sm"
      backgroundColor="surface-secondary"
      gap="spacing-xs"
      position="absolute"
      css={css`
        bottom: 24px;
      `}
      width="328px"
    >
  
      <Text color="text-secondary" variant="bes-semibold">
        You are browsing using an external wallet.
        <br /> Create an account & link wallet to unlock all features.
      </Text>
      <Button
        size="extraSmall"
        block
        onClick={() => handlePushWalletCreation()}
      >
        Create Account
      </Button>
    </Box>
  );
};

export { CreateAccount };
