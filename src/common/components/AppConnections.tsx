import React, { FC, useState } from "react";
import { WalletListType } from "../../modules/wallet/Wallet.types";
import { useGlobalState } from "../../context/GlobalContext";
import { AppConnection } from "../../services/pushWallet/pushWallet.types";
import { DrawerWrapper } from "./DrawerWrapper";
import { ConnectionSuccess } from "./ConnectionSuccess";
import { AppConnectionStatus } from "./AppConnectionStatus";
import { ErrorContent } from "./ErrorContent";
import { Info } from "blocks";

export type AppConnectionsProps = {
  selectedWallet: WalletListType;
  appConnection: AppConnection;
};

const AppConnections: FC<AppConnectionsProps> = ({
  selectedWallet,
  appConnection,
}) => {

  const { state, dispatch } = useGlobalState();

  const [appConnectionStatus, setAppConnectionStatus] = useState<"rejected" | "notReceived" | "connected" | "pending">(appConnection.appConnectionStatus)

  const handleAccept = (origin: string) => {
    if (state.wallet) {
      state?.wallet?.acceptConnectionReq(origin);
      setAppConnectionStatus('connected')
    }
  };

  const handleReject = (origin: string) => {
    if (state.wallet) {
      state?.wallet?.rejectConnectionReq(origin);
      setAppConnectionStatus('rejected')
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

  const handleCloseWhenSuccess = async () => {
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

  const handleCloseWhenReject = () => {
    if (state.wallet) {
      dispatch({ type: "INITIALIZE_WALLET", payload: state.wallet });
      removeAppStateFromURL()
    }
  }

  const handleCloseTabWhenReject = () => {

    if (window.opener) {
      window.opener.postMessage("closeAndFocusParent", "http://localhost:5174");
    }

    window.close();
  }

  return (
    <DrawerWrapper>

      {appConnectionStatus === 'connected' && (
        <ConnectionSuccess
          onClose={handleCloseWhenSuccess}
        />
      )}

      {appConnectionStatus === 'rejected' && (
        <ErrorContent
          icon={<Info size={32} color="icon-state-danger-subtle" />}
          title="Could not verify"
          subTitle="Please go back to the app and retry"
          retryText="Close"
          onClose={() => handleCloseWhenReject()}
          onRetry={() => handleCloseTabWhenReject()}
          note="Closing this window will log you out."
        />
      )}

      {(appConnectionStatus === 'notReceived' || appConnectionStatus === 'pending') && (
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
