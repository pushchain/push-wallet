import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Spinner } from "../blocks";
import { APP_ROUTES } from "../constants";
import { useGlobalState } from "../context/GlobalContext";
import { PushWalletLoadingContent, SkeletonWalletScreen } from "common";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const {
    state: { walletLoadState, jwt, dynamicWallet },
  } = useGlobalState();

  if (walletLoadState === "idle" || walletLoadState === "loading") {
    return <SkeletonWalletScreen loadingPopup={<PushWalletLoadingContent />} />;
  }

  if (walletLoadState === "success" && jwt) {
    return <>{children}</>;
  }

  if (walletLoadState === "success" && dynamicWallet) {
    return <>{children}</>;
  }

  return <Navigate to={APP_ROUTES.AUTH} />;
};

export { PrivateRoute };
