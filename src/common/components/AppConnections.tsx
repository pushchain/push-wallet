import React, { FC, useState } from "react";
import { WalletListType } from "../../modules/wallet/Wallet.types";
import { useGlobalState } from "../../context/GlobalContext";
import { AppConnection } from "../../services/pushWallet/pushWallet.types";
import { DrawerWrapper } from "./DrawerWrapper";
import { ConnectionSuccess } from "./ConnectionSuccess";
import { AppConnectionStatus } from "./AppConnectionStatus";

export type AppConnectionsProps = {
  selectedWallet: WalletListType;
  appConnection: AppConnection;
};

const AppConnections: FC<AppConnectionsProps> = ({
  selectedWallet,
  appConnection,
}) => {

  const { state, dispatch } = useGlobalState();

  // Setting isAppConnected as appConnection.isPending to decide either to display the success drawer or connection request
  const [isAppConnected, setIsAppConnected] = useState(appConnection.appConnectionStatus !== 'pending');

  const handleAccept = (origin: string) => {
    if (state.wallet) {
      state?.wallet?.acceptConnectionReq(origin);
      setIsAppConnected(true)
    }
  };

  const handleReject = (origin: string) => {
    if (state.wallet) {
      state?.wallet?.rejectConnectionReq(origin);
      dispatch({ type: "INITIALIZE_WALLET", payload: state.wallet });
      // remov the app from the URL
      removeAppStateFromURL()
    }
  };

  const handleRejectAllConnections = async () => {
    if (state.wallet) {
      state?.wallet?.rejectAllConnectionReqs();
      dispatch({ type: "INITIALIZE_WALLET", payload: state.wallet });
      // remov the app from the URL
      removeAppStateFromURL()
    }
  };

  const handleCloseSuccessConnection = async () => {
    if (state.wallet) {
      // remove the URL and close the drawer by removing the app from the URL
      removeAppStateFromURL();
      // dispatch the wallet when the user closes the success tab
      dispatch({ type: "INITIALIZE_WALLET", payload: state.wallet });
    }
  }

  const removeAppStateFromURL = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('app');
    window.history.replaceState({}, document.title, url.toString());
  }

  return (
    <DrawerWrapper>
      {isAppConnected ? (
        <ConnectionSuccess
          onClose={handleCloseSuccessConnection}
        />
      ) : (
        <AppConnectionStatus
          selectedWallet={selectedWallet}
          appConnection={appConnection}
          onSuccess={handleAccept}
          onReject={handleReject}
          onRejectAll={handleRejectAllConnections}
        />
      )}
    </DrawerWrapper>
  );
};

export { AppConnections };
