import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Authentication } from "../../modules/Authentication";
import OTPVerification from "../../modules/Authentication/OTPVerification";
import { Wallet } from "../../modules/wallet";
import { PrivateRoute } from "./PrivateRoute";
import { APP_ROUTES } from "../../constants";
import { usePersistedQuery } from "../hooks/usePersistedQuery";
import { OAuthRedirect } from "../../modules/OAuth/OAuthRedirect";
import OTPAuthentication from "../../modules/Authentication/OTPAuthentication";

const RouterContainer: FC = () => {
  const persistQuery = usePersistedQuery();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={persistQuery(APP_ROUTES.WALLET)} />}
      />
      <Route path={APP_ROUTES.OAUTH_REDIRECT} element={<OAuthRedirect />} />
      <Route
        path={APP_ROUTES.WALLET}
        element={
          <PrivateRoute>
            <Wallet />
          </PrivateRoute>
        }
      />
      <Route path={APP_ROUTES.AUTH} element={<Authentication />} />
      <Route
        path={APP_ROUTES.VERIFY_EMAIL_OTP}
        element={
          <OTPVerification
            userId=""
            onVerificationComplete={() => { }}
          />
        }
      />
      <Route path={APP_ROUTES.REVERIFY_EMAIL_OTP} element={<OTPAuthentication />} />
    </Routes>
  );
};

export { RouterContainer };
