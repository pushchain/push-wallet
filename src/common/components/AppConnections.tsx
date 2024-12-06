import { FC, useState } from "react";
import { Info } from "blocks";
import { WalletListType } from "../../modules/wallet/Wallet.types";
import { useGlobalState } from "../../context/GlobalContext";
import { AppConnection } from "../../services/pushWallet/pushWallet.types";
import { DrawerWrapper } from "./DrawerWrapper";
import { ConnectionSuccess } from "./ConnectionSuccess";
import { AppConnectionStatus } from "./AppConnectionStatus";
import { ErrorContent } from "./ErrorContent";
import { useWalletEvents } from "../hooks";

export type AppConnectionsProps = {
  selectedWallet: WalletListType;
  appConnection: AppConnection;
};

const AppConnections: FC<AppConnectionsProps> = ({
  selectedWallet,
  appConnection,
}) => {
  const { state, dispatch } = useGlobalState();

  const [appConnectionStatus, setAppConnectionStatus] = useState<
    AppConnection["appConnectionStatus"]
  >(appConnection.appConnectionStatus);

  const handleAccept = (origin: string) => {
    state.handleAppConnectionSuccess(origin);
    setAppConnectionStatus("connected");

    // if (state.wallet) {
    //   state?.wallet?.acceptConnectionReq(origin);
    // }
  };

  const handleReject = () => {
    state.handleAppConnectionRejected();
    setAppConnectionStatus("rejected");

    // if (state.wallet) {
    //   state?.wallet?.rejectConnectionReq(origin);
    // }
  };

  const handleRejectAllConnections = async () => {
    state.handleRejectAllAppConnections();

    // if (state.wallet) {
    //   state?.wallet?.rejectAllConnectionReqs();
    //   dispatch({ type: "INITIALIZE_WALLET", payload: state.wallet });
    // }
  };

  const handleCloseWhenSuccess = async () => {
    if (state.wallet) {
      // dispatch the wallet when the user closes the success tab
      dispatch({ type: "INITIALIZE_WALLET", payload: state.wallet });
    }
  };

  const handleCloseWhenReject = () => {
    if (state.wallet) {
      dispatch({ type: "INITIALIZE_WALLET", payload: state.wallet });
    }
  };

  const handleCloseTabWhenReject = () => {
    window.close();
  };

  return (
    <DrawerWrapper>
      {appConnectionStatus === "connected" && (
        <ConnectionSuccess onClose={handleCloseWhenSuccess} />
      )}

      {appConnectionStatus === "rejected" && (
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

      {(appConnectionStatus === "notReceived" ||
        appConnectionStatus === "pending") && (
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
