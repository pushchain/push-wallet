import React, { ReactNode, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Spinner } from "../blocks";
import { PushWalletLoadingContent, SkeletonWalletScreen } from "common";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { loadingUser, sessionToken } = useContext(AuthContext);

  console.log("loding user: " + loadingUser);

  if (loadingUser === "loading" || loadingUser === "idle")
    return <SkeletonWalletScreen loadingPopup={<PushWalletLoadingContent />} />;
  else if (loadingUser === "success" || sessionToken) return <>{children}</>;
  else return <Navigate to="/auth" />;
};

export { PrivateRoute };
