import { FC, useState } from "react";
import { Info } from "blocks";
import { WalletListType } from "../../modules/wallet/Wallet.types";
import { useGlobalState } from "../../context/GlobalContext";
import { DrawerWrapper } from "./DrawerWrapper";
import { ConnectionSuccess } from "./ConnectionSuccess";
import { AppConnectionStatus } from "./AppConnectionStatus";
import { ErrorContent } from "./ErrorContent";
import { useEventEmitterContext } from "../../context/EventEmitterContext";
import { PushWalletAppConnectionData } from "../Common.types";
import { getAppParamValue } from "../Common.utils";

export type PushWalletAppConnectionProps = {
  selectedWallet: WalletListType;
};

const PushWalletAppConnection: FC<PushWalletAppConnectionProps> = ({
  selectedWallet,
}) => {
  const { state } = useGlobalState();

  const {
    handleAppConnectionRejected,
    handleAppConnectionSuccess,
    handleRetryAppConnection,
  } = useEventEmitterContext();

  const [appConnectionStatus, setAppConnectionStatus] = useState<
    | PushWalletAppConnectionData["appConnectionStatus"]
    | "rejected"
    | "notVisible"
  >(null);

  const handleAccept = (origin: string) => {
    handleAppConnectionSuccess(origin);
    setAppConnectionStatus("connected");
  };

  const handleReject = (origin: string) => {
    handleAppConnectionRejected(origin);
    setAppConnectionStatus("rejected");
  };

  const handleCloseWhenSuccess = () => setAppConnectionStatus("notVisible");

  const handleCloseTabWhenReject = () => {
    handleRetryAppConnection();
  };

  const hasPendingRequest = state?.appConnections.some(
    (cx) => cx.appConnectionStatus === "pending"
  );

  const latestAppConnectionRequest =
    state?.appConnections[state?.appConnections.length - 1];

  if (
    hasPendingRequest &&
    latestAppConnectionRequest?.appConnectionStatus === "pending"
  ) {
    return (
      <DrawerWrapper>
        <AppConnectionStatus
          selectedWallet={selectedWallet}
          appConnection={latestAppConnectionRequest}
          onSuccess={handleAccept}
          onReject={handleReject}
        />
      </DrawerWrapper>
    );
  }

  if (
    appConnectionStatus === "connected" &&
    latestAppConnectionRequest?.appConnectionStatus === "connected" &&
    getAppParamValue()
  )
    return (
      <DrawerWrapper>
        <ConnectionSuccess onClose={handleCloseWhenSuccess} />
      </DrawerWrapper>
    );

  if (appConnectionStatus === "rejected")
    return (
      <DrawerWrapper>
        <ErrorContent
          icon={<Info size={32} color="pw-int-error-primary-subtle-color" />}
          title="Rejected by user"
          subTitle="Try again to authenticate"
          retryText="Retry"
          onRetry={handleCloseTabWhenReject}
        />
      </DrawerWrapper>
    );

  return null;
};

export { PushWalletAppConnection };
