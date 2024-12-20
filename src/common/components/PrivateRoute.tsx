import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { APP_ROUTES } from "../../constants";
import { useGlobalState } from "../../context/GlobalContext";
import { PushWalletLoadingContent, WalletSkeletonScreen } from "common";
import { usePersistedQuery } from "../hooks/usePersistedQuery";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const {
    state: { walletLoadState, jwt, dynamicWallet },
  } = useGlobalState();

  const persistQuery = usePersistedQuery();

  if (walletLoadState === "idle" || walletLoadState === "loading") {
    return <WalletSkeletonScreen content={<PushWalletLoadingContent />} />;
  }

  if (walletLoadState === "success" && jwt) {
    return <>{children}</>;
  }

  if (walletLoadState === "success" && dynamicWallet) {
    return <>{children}</>;
  }

  return <Navigate to={persistQuery(APP_ROUTES.AUTH)} />;
};

export { PrivateRoute };
