import { DrawerWrapper, LoadingContent } from "common";
import React from "react";
import { useAppState } from "../../../context/AppContext";
import {
  getNetwork,
  useDynamicContext,
  useSwitchNetwork,
} from "@dynamic-labs/sdk-react-core";
import { base } from "viem/chains";
import { Button } from "blocks";

const SwitchNetwork = () => {
  const { dispatch } = useAppState();

  const switchNetwork = useSwitchNetwork();
  const { primaryWallet } = useDynamicContext();

  const checkAndSwitchNetwork = async () => {
    if (!primaryWallet) {
      console.log("No primary wallet connected");
      return;
    }

    const currentNetwork = await primaryWallet.connector.getNetwork();
    console.log("currentNetwork", currentNetwork);

    if (primaryWallet.connector.supportsNetworkSwitching()) {
      try {
        await switchNetwork({ wallet: primaryWallet, network: base.id });
        console.log("Successfully switched to Base network");
      } catch (error) {
        if (error.code === 4001) {
          console.log("User rejected the network switch");
        } else {
          console.error("Error switching network:", error);
        }
      }
    } else {
      console.log("This wallet does not support network switching");
    }
  };
  return (
    <DrawerWrapper>
      <Button onClick={checkAndSwitchNetwork}>Change to base</Button>
      <LoadingContent
        title=""
        subTitle="Allow the site to connect and continue"
        // onClose={() =>
        //   dispatch({
        //     type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
        //     payload: "rejected",
        //   })
        // }
      />
    </DrawerWrapper>
  );
};

export default SwitchNetwork;
